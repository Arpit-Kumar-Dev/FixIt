const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("./s3-cred");

exports.PutObjectCommand = async (file, fileName) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${fileName}`, 
            Body: file,
            ContentType: "image/jpeg", 
        };

        const command = new PutObjectCommand(params);
        const data = await S3Client.send(command);

        if (data.$metadata.httpStatusCode !== 200) {
            console.error("S3 Upload Failed:", data);
            return null; 
        }

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        console.log("Uploaded URL:", url);

        return { url, key: params.Key };
    } catch (err) {
        console.error("S3 Upload Error:", err); 
        return null; 
    }
};
