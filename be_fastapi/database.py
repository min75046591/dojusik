from databases import Database
from sqlalchemy import create_engine, MetaData

# MySQL 연결 정보 설정
DATABASE_URL = "mysql+aiomysql://@localhost:3306/dojusick"

# 비동기 데이터베이스 객체 생성
database = Database(DATABASE_URL)

# SQLAlchemy 엔진 및 메타데이터 설정
engine = create_engine(DATABASE_URL)
metadata = MetaData()
