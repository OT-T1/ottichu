import config
from db_connect import db
from flask import Flask
from flask_migrate import Migrate

from flaskr.controller import data, user


def create_app(test_config=None):
    app = Flask(__name__)

    app.register_blueprint(data)
    app.register_blueprint(user)

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

    return app
