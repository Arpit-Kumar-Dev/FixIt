const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3-credentials");


exports.getObject = async(key) =>{
    try{
        const params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:key
        }
        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);
        return data;
        
    }catch(err){
        console.error(err);
    }
}