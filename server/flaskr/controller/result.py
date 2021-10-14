from flask import Blueprint, request
from flaskr.service import Result

result = Blueprint("result", __name__, url_prefix="/api/result")

# 결과 데이터
@result.route("", methods=["GET"])
def get_user_result():
    user_code = request.args.get("user_code")
    return Result.get_result_recom(user_code=user_code)


@result.route("/wordcloud", methods=["GET"])
def get_user_wordcloud():
    user_code = request.args.get("user_code")
    return Result.get_wordcloud(user_code=user_code)
