const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
// require('dotenv').config()
const AWS = require('aws-sdk')
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { credentials} = require('@aws-sdk/types');
const {ENV_BUCKETCONSTANTS} = require("./s3constants.js")
const region = ENV_BUCKETCONSTANTS.AWS_REGION
const encoding = ENV_BUCKETCONSTANTS.ENCODED_TYPE
const bucketName = ENV_BUCKETCONSTANTS.bucketName
const accessKey = ENV_BUCKETCONSTANTS.AccessKeyId
const secretKey = ENV_BUCKETCONSTANTS.secretAccessKey

const uploadFile = async(id, fileContent) => {
    // const creds = new credentials.StaticCredentialsProvider({
    //     accessKey,
    //     secretKey
    // })

    // const credentials = new AWS.Credentials(accessKey, secretKey)
    // //signer
    // const signer = new SignatureV4({
    //     credentials
    // })

    // //S3 cli
    // const s3Client = new S3Client({
    //     region: region,
    //     signer
    // })
console.log(accessKey)
console.log(secretKey)
console.log(region)
console.log(ENV_BUCKETCONSTANTS.SIGNATURE_VERSION)
const credentials = new AWS.Credentials(accessKey, secretKey);
AWS.config.credentials = credentials;

    const s3Client = new AWS.S3({
        signatureVersion: ENV_BUCKETCONSTANTS.SIGNATURE_VERSION,
        region: region
    })

    //params for 
    const params = {
        Bucket: bucketName,
        Key: id,
        Body: fileContent
    }

    //send to s3 bucket
    try{
        const result = await s3Client.upload(params).promise()
        console.log(result)
    } catch(e){
        console.log(e)
    }

}



// const uploadFile = async(id,fileContent) => {
//     const params = {
//         Bucket: bucketName,
//         Key: id,
//         Body: fileContent
//     }
//     console.log(params)
//     const result = await s3Client.send(new PutObjectCommand(params));
//     console.log(result)
// }

module.exports ={
    uploadFile
}