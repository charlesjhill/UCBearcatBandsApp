from ariadne import ObjectType, make_executable_schema, gql, snake_case_fallback_resolvers, UnionType

from .bands.models import Instrument, Locker, UniformPiece

type_defs = gql('''
    type Query {
        hello: String! @deprecated
        instruments: [Instrument!]!
        lockers: [Locker!]!
    }

    """
    An instrument
    """
    type Instrument implements AssetBase {
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
    }

    type UniformPiece implements AssetBase {
        name: String
        condition: String!
        locker: Locker
        kind: String!
        size: String!
        number: String!
    }

    interface AssetBase {
        name: String
        condition: String!
        locker: Locker
    }

    type Locker {
        number: Int!
        combination: String!
        assets: [Asset!]
    }

    union Asset = Instrument | UniformPiece
''')

query = ObjectType("Query")

@query.field("hello")
def resolve_hello(*_):
    return "Hello, you!"

@query.field("instruments")
def resolve_instruments(*_):
    return Instrument.objects.all()

@query.field("lockers")
def resolve_lockers(*_):
    return Locker.objects.all()


instrument = ObjectType("Instrument")

@instrument.field("averageLife")
def resolve_averageLife(inst: Instrument, _):
    return Instrument.AVERAGE_LIFE_OF_INSTRUMENT.get(inst.kind)

locker = ObjectType("Locker")

@locker.field("assets")
def resolve_assets(locker: Locker, _):
    return locker.assets.all()

asset = UnionType("Asset")

@asset.type_resolver
def resolve_asset_type(obj, *_):
    if isinstance(obj, Instrument):
        return "Instrument"
    if isinstance(obj, UniformPiece):
        return "UniformPiece"
    return None

schema = make_executable_schema(type_defs, query, instrument, locker, asset, snake_case_fallback_resolvers)