from flask import Blueprint, request
from flaskr.service import Actors, Contents, Directors

data = Blueprint("data", __name__, url_prefix="/api/data")

# 추천 컨텐츠
@data.route("/contents", methods=["GET"])
def get_recommend_content():
    user_code = request.args.get("user_code")
    return Contents().get_contents(user_code=user_code)


@data.route("/actors", methods=["GET"])
def get_actors():
    return Actors.get_actors(query=request.args.get("query"))


@data.route("/directors", methods=["GET"])
def get_directors():
    return Directors.get_directors(query=request.args.get("query"))
