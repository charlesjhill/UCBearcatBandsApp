import os

class Database:
    TYPE = os.getenv('DATABASE')
    NAME = os.getenv('POSTGRES_DB')
    USER = os.getenv('POSTGRES_USER')
    PASSWORD = os.getenv('POSTGRES_PASSWORD')
    HOST = os.getenv('DATABASE_HOST')
    PORT = os.getenv('DATBASE_PORT')

class Secrets:
    SECRET_KEY = 'q_m-h+uudmjczt5j%-3@vmok^_@j&_g=_6x+^yw55gczi4l$6h'