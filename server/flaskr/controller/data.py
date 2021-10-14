import ast

from flask import Blueprint, request
from flask.json import jsonify
from flaskr.service import Actors, Contents, Directors

data = Blueprint("data", __name__, url_prefix="/api/data")

# 추천 컨텐츠
@data.route("/contents", methods=["GET"])
def get_recommend_content():
    try:
        user_code = request.args.get("user_code")
        history_codes = ast.literal_eval(
            "["
            + (request.args.get("history") if request.args.get("history") else "")
            + "]"
        )
        print(history_codes)
        contents_service = Contents()
        return contents_service.get_contents(
            user_code=user_code, history_codes=history_codes
        )
    except Exception as e:
        print(e)
        return jsonify(result="fail")


@data.route("/actors", methods=["GET"])
def get_actors():
    return Actors.get_actors(query=request.args.get("query"))


@data.route("/directors", methods=["GET"])
def get_directors():
    return Directors.get_directors(query=request.args.get("query"))
