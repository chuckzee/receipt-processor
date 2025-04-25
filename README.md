# Receipt Processor

Hello Fetch! Thanks for the opportunity - I enjoy API development so this was a fun project. 

## Language

I specialize in JavaScript frameworks, so I chose TypeScript and Node to develop this. Node and Express are extremely common pairings for API dev, and Express is a natural fit for microservices. 

The unit testing framework is Jest, and I'm leveraging supertest to test my endpoints. 

## Build Instructions 

Prerequisites:
- Docker

In a terminal, run the following command:

```
docker build -t receipt-processor .
```

This will build our receipt-processor Docker image and tag it as receipt-processor. 

## Run Instructions

In a terminal, run the following command:

```
docker run -p 3000:3000 receipt-processor
```

This will run the receipt-processor Docker container and map port 3000 to the container's port 3000. 

The container should now be running on port 3000 and accept any requests.

## Future Improvements or Considerations

As you noted in the instructions, this is running in memory only. If I were to scale this, I would likely go with a noSQL database solution like MongoDB. Additionally, integration tests or a postman collection would be useful to test the API endpoints. 
