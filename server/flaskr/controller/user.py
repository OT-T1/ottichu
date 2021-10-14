from flask import Blueprint, request
from flaskr.service import User

user = Blueprint("user", __name__, url_prefix="/api/user")

# 유저가 선택한 입력들
@user.route("/info", methods=["POST"])
def post_user_input():
    info = request.json
    return User.input_user_info(info=info)


# 유저가 선택한 컨텐츠
@user.route("/contents", methods=["PATCH"])
def patch_user_content():
    data = request.json
    return User.input_user_contents(data=data)
