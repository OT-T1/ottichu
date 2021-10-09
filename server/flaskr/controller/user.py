from flask import Blueprint, request

user = Blueprint("user", __name__, url_prefix="/api/user")

# 유저가 선택한 입력들
@user.route("/input-data", methods=["POST"])
def post_user_input():
    return None


# 유저가 선택한 컨텐츠
@user.route("/contents", methods=["PATCH"])
def patch_user_content():
    return None


# 결과 데이터
@user.route("/result", methods=["GET"])
def get_user_result():
    return None
