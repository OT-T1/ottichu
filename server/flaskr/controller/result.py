from flask import Blueprint, request
from flaskr.service import Result

result = Blueprint("result", __name__, url_prefix="/api/result")

# 결과 데이터
@result.route("", methods=["GET"])
def get_user_result():
    result = Result()
    return result.get_result()


@result.route("/wordcloud", methods=["GET"])
def get_user_wordcloud():
    result = Result()
    return result.get_wordcloud()
