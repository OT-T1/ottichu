import boto3
import pandas as pd

import config

CSV_PATH = "INSERT YOUR CSV FILE PATH"
IMG_PATH = "INSERT YOUR IMAGE FOLDER PATH"


def s3_connection():
    try:
        s3 = boto3.client(
            service_name="s3",
            region_name=config.AWS_S3_BUCKET_REGION,
            aws_access_key_id=config.AWS_ACCESS_KEY,
            aws_secret_access_key=config.AWS_ACCESS_SECRET_KEY,
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3


def s3_put_object(s3, bucket, filepath, access_key):
    """
    s3 bucket에 지정 파일 업로드
    :param s3: 연결된 s3 객체(boto3 client)
    :param bucket: 버킷명
    :param filepath: 파일 위치
    :param access_key: 저장 파일명
    :return: 성공 시 True, 실패 시 False 반환
    """
    try:
        s3.upload_file(
            Filename=filepath,
            Bucket=bucket,
            Key=access_key,
            ExtraArgs={"ContentType": "image/jpg", "ACL": "public-read"},
        )
    except Exception as e:
        return False
    return True


def s3_get_image_url(filename):
    location = s3.get_bucket_location(Bucket=config.AWS_S3_BUCKET_NAME)[
        "LocationConstraint"
    ]
    return f"https://{config.AWS_S3_BUCKET_NAME}.s3.{location}.amazonaws.com/{filename}.jpg"


def insert_image_all():
    for fileid in df.id:
        try:
            if s3_put_object(
                s3,
                config.AWS_S3_BUCKET_NAME,
                f"{IMG_PATH}/{fileid}.jpg",
                f"{fileid}.jpg",
            ):
                print("success")
                df.loc[df["id"] == fileid, ("s3_imgurl")] = s3_get_image_url(fileid)
        except Exception as e:
            pass


s3 = s3_connection()

df = pd.read_csv(CSV_PATH)
df["s3_imgurl"] = None

insert_image_all()
