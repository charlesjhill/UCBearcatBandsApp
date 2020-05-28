from ariadne import ObjectType, make_executable_schema, gql, snake_case_fallback_resolvers, UnionType, ScalarType

from .bands.models import Instrument, Locker, UniformPiece, Ensemble, Student, Asset

type_defs = gql('''
    type Query {
        instruments(id: ID): [Instrument!]!
        lockers: [Locker!]!
        ensembles: [Ensemble!]!
        students(id: ID): [Student!]!
    }

    type Ensemble {
        id: ID!
        name: String!
        term: String!
        isActive: Boolean!
        members: [Student!]!
        enrollments: [Enrollment!]!
    }

    type Enrollment {
        student: Student!
        ensemble: Ensemble!
        assets: [Asset!]!
        assetAssignments: [AssetAssignment!]!
    }

    type AssetAssignment {
        enrollment: Enrollment!
        asset: Asset!
        isActive: Boolean!
    }

    type Student {
        user: User!
        mNumber: String!
        assets: [Asset!]!
        enrollments: [Enrollment!]!
    }

    type User {
        id: ID!
        fullName: String!
        email: String!
        isStudent: Boolean!
    }

    """An instrument"""
    type Instrument implements AssetBase {
        id: ID!
        name: String
        kind: String!
        make: String!
        model: String!
        serialNumber: String!
        ucTagNumber: String
        ucAssetNumber: String
        condition: String!
        averageLife: Int!
        locker: Locker
        purchaseInfo: PurchaseInfo
        students: [Student!]!
        enrollments: [Enrollment!]!
        assignments: [AssetAssignment!]!
    }

    type UniformPiece implements AssetBase {
        id: ID!
        name: String
        condition: String!
        locker: Locker
        kind: String!
        size: String!
        number: String!
        purchaseInfo: PurchaseInfo
        students: [Student!]!
        enrollments: [Enrollment!]!
        assignments: [AssetAssignment!]!
    }

    interface AssetBase {
        id: ID!
        name: String
        condition: String!
        locker: Locker
        purchaseInfo: PurchaseInfo
        students: [Student!]!
        enrollments: [Enrollment!]!
        assignments: [AssetAssignment!]!
    }

    type Locker {
        id: ID!
        number: Int!
        combination: String!
        assets: [Asset!]
    }

    type PurchaseInfo {
        id: ID!
        date: Date!
        cost: Float!
        vendor: String!
        invoiceNumber: String!
        content: String!
    }

    union Asset = Instrument | UniformPiece

    scalar Date
''')

query = ObjectType("Query")
instrument = ObjectType("Instrument")
uniform = ObjectType("UniformPiece")
locker = ObjectType("Locker")
ensemble = ObjectType("Ensemble")
enrollment = ObjectType("Enrollment")
student = ObjectType("Student")

@query.field("instruments")
def resolve_instruments(parent, info, id=None):
    if (id is None):
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
    if (id is None):
        return Student.objects.all()
    
    return [Student.objects.get(pk=id)]

@instrument.field("averageLife")
def resolve_averageLife(inst: Instrument, _):
    return Instrument.AVERAGE_LIFE_OF_INSTRUMENT.get(inst.kind)

@instrument.field("assignments")
@uniform.field("assignments")
def resolve_assignments(asset, _):
    return asset.assignments.all()

@locker.field("assets")
@enrollment.field("assets")
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
def resolve_asset_assignments(enrollment, _):
    return enrollment.asset_assignments.all()


@instrument.field("students")
@uniform.field("students")
def resolve_students_using_asset(asset, _):
    return Student.objects.filter(enrollments__asset_assignments__asset=asset)

@student.field("assets")
def resolve_assets_from_student(student, _):
    return Asset.objects.filter(enrollments__student=student)

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


schema = make_executable_schema(type_defs, \
                                query, \
                                student, \
                                enrollment, \
                                instrument, \
                                locker, \
                                asset, \
                                ensemble, \
                                uniform, \
                                date_scalar, \
                                snake_case_fallback_resolvers)