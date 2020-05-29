from ariadne import ObjectType, make_executable_schema, snake_case_fallback_resolvers, UnionType, ScalarType, \
    load_schema_from_path
from .bands.models import Instrument, Locker, UniformPiece, Ensemble, Student, Asset, Enrollment, Invoice, LineItem
from django.db.models import Sum, QuerySet

type_defs = load_schema_from_path("schema/")

query = ObjectType("Query")
instrument = ObjectType("Instrument")
uniform = ObjectType("UniformPiece")
locker = ObjectType("Locker")
ensemble = ObjectType("Ensemble")
enrollment = ObjectType("Enrollment")
student = ObjectType("Student")
line_item = ObjectType("LineItem")
invoice = ObjectType("Invoice")


# Query Fields


@query.field("instruments")
def resolve_instruments(parent, info, id=None):
    if id is None:
        return Instrument.objects.all()

    return [Instrument.objects.get(pk=id)]


@query.field("lockers")
def resolve_lockers(*_):
    return Locker.objects.all()


@query.field("ensembles")
def resolve_ensembles(*_):
    return Ensemble.objects.all()


@query.field("students")
def resolve_students(*_, id=None):
    if id is None:
        return Student.objects.all()

    return [Student.objects.get(pk=id)]


# Everything else


@instrument.field('invoices')
@uniform.field('invoices')
def resolve_invoices(asset: Asset, _, type: str = None):
    if type is None:
        return asset.invoices.all()

    q = asset.line_items.all()

    if type == 'PURCHASE':
        q = q.filter(type=LineItem.purchase)
    elif type == 'MAINTENANCE':
        q = q.filter(type=LineItem.maintenance)

    return [li.invoice for li in q.select_related('invoice')]


@invoice.field("lineItems")
@instrument.field("lineItems")
@uniform.field("lineItems")
def resolve_line_items(inv: Invoice, type: str = None):
    q = inv.line_items.all()

    if type == 'PURCHASE':
        q = q.filter(type=LineItem.purchase)
    elif type == 'MAINTENANCE':
        q = q.filter(type=LineItem.maintenance)

    return q


@invoice.field("totalPrice")
@instrument.field('accumulatedCost')
@uniform.field('accumulatedCost')
def resolve_total_price(inv: Invoice, _):
    q: dict = inv.line_items.aggregate(total_price=Sum('cost'))
    total_price: float = q['total_price']

    return 0 if (total_price is None) else total_price


@instrument.field("averageLife")
def resolve_average_life(inst: Instrument, _):
    return Instrument.AVERAGE_LIFE_OF_INSTRUMENT.get(inst.kind)


@instrument.field("assignments")
@uniform.field("assignments")
def resolve_assignments(asset, _):
    return asset.assignments.all()


@locker.field("assets")
@enrollment.field("assets")
@invoice.field("assets")
def resolve_assets(x, _):
    return x.assets.all()


@ensemble.field("members")
def resolve_members(ensm: Ensemble, _):
    return ensm.members.all()


@ensemble.field("enrollments")
@student.field("enrollments")
@instrument.field("enrollments")
@uniform.field("enrollments")
def resolve_enrollments(ensm: Ensemble, _):
    return ensm.enrollments.all()


@enrollment.field("assetAssignments")
def resolve_asset_assignments(enr: Enrollment, _):
    return enr.asset_assignments.all()


@instrument.field("students")
@uniform.field("students")
def resolve_students_using_asset(asset, _):
    return Student.objects.filter(enrollments__asset_assignments__asset=asset)


@student.field("assets")
def resolve_assets_from_student(s: Student, _):
    return Asset.objects.filter(enrollments__student=s)


asset = UnionType("Asset")


@asset.type_resolver
def resolve_asset_type(obj, *_):
    if isinstance(obj, Instrument):
        return "Instrument"
    if isinstance(obj, UniformPiece):
        return "UniformPiece"
    return None


date_scalar = ScalarType("Date")


@date_scalar.serializer
def serialize_date(value):
    return value.isoformat()


schema = make_executable_schema(type_defs,
                                query,
                                line_item,
                                invoice,
                                student,
                                enrollment,
                                instrument,
                                locker,
                                asset,
                                ensemble,
                                uniform,
                                date_scalar,
                                snake_case_fallback_resolvers)
