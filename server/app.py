from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

import config
from db_connect import db
from flaskr.controller import data, result, user
from mecab import mecab_data


def create_app(test_config=None):
    app = Flask(__name__)

    app.register_blueprint(data)
    app.register_blueprint(user)
    app.register_blueprint(result)

    # Config 설정
    if test_config is None:
        app.config.from_object(config)
    else:
        app.config.update(test_config)

    # DB와 app 이어주기 및 migration 설정
    db.init_app(app)
    Migrate().init_app(app, db, compare_type=True)
    from flaskr.models import (
        actors,
        content_actor,
        content_director,
        content_genre,
        contents,
        directors,
        genres,
        ott_infos,
        user_actors,
        user_contents,
        user_directors,
        users,
    )

    CORS(app)

    # 현재 mecab_data를 객체로 저장
    mecab_data.make_data()
    mecab_data.close_db()
    return app


if __name__ == "__main__":
    create_app().run()
