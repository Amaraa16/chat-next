export default async function mondoDataApiReq(action: any, options: any) {
  const result = await fetch(
    `https://ap-south-1.aws.data.mongodb-api.com/app/data-ydvkv/endpoint/data/v1/action/${action}`,
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "api-key":
          "Z3AwcMYBeJ1qPG9hcuH58U6VZ9QSSwDDVSzrEBT9Jfdbvcyo3PJKj98D0gd0Xkvn",
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "message",
        collection: "message",
        ...options,
      }),
    }
  ).then((res) => res.json());

  return result;
}
