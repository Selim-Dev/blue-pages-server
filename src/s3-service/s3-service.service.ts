import { Injectable, NotFoundException, Req, Res, InternalServerErrorException } from '@nestjs/common';
import * as AWS from "aws-sdk";
import * as multer from 'multer';

@Injectable()
export class S3Service {
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
    s3 = new AWS.S3
        ({
            accessKeyId: process.env.ID_ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });

    async s3UploadFile(file) {
			console.log({file})
        const { originalName } = file;
        if (!originalName) { throw new NotFoundException('please add image to your request') }
        const originalnamerondum = Date.now() + originalName

        return  this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalnamerondum, file.mimetype);

    }
    async s3_upload(file, bucket, name, mimetype) {
        const params =
        {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition: "inline",
            CreateBucketConfiguration:
            {
                LocationConstraint: "ap-south-1"
            }
        };
        try {
            let s3Response = await this.s3.upload(params).promise();
            // console.log(s3Response, "hhhhhhhh")
            return s3Response
        }
        catch (e) {
            throw new NotFoundException("image has not been uploaded with error : " + e)
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Upload Imagess
    // async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    //     const uploadResult = await this.s3.upload({
    //         Bucket: this.AWS_S3_BUCKET,
    //         Body: dataBuffer,
    //         Key: `${uuid()}-${filename}`
    //     })
    //         .promise();

    // }



    async s3DeleteFile(image_key) {
        // const params = {
        //     Bucket: this.AWS_S3_BUCKET,
        //     Key: image_key
        // };
        try {
            await this.s3.deleteObject({ Bucket: this.AWS_S3_BUCKET, Key: image_key }).promise();
            return "Image deleted Successfully"
        } catch (e) {
            throw new NotFoundException("image has not deleted with error : " + e)
        }
    }


    async s3Replace(image_key, file) {
        // const grttt = await this.s3.getObject(image_key).promise();
        // console.log(grttt, "eeeee")

        // const params = { Bucket: this.AWS_S3_BUCKET, Key: image_key, Body: file.buffer };
        // const uploadedBlob = await this.s3.putObject(params).promise();
        try {
            if (image_key) {
                await this.s3DeleteFile(image_key)
            }
            const upload_file = await this.s3UploadFile(file)
            return upload_file
        } catch (e) {
            throw new NotFoundException("image has not updated with error : " + e)
        }
    }


    async s3Update(image_key, file) {
				if (image_key) {
					const params = { Bucket: this.AWS_S3_BUCKET, Key: image_key, Body: file.buffer,ACL:"public-read",ContentType:file.mimetype };
					try{
						await this.s3.putObject(params).promise();
						return true
					}catch(err){
						console.log({err})
						throw new InternalServerErrorException(err)
					}
				}
    }


}