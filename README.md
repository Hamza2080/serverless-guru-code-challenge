# Serverless Guru Notes challenge

A Simple notes CRUD in serverless framework 

## Project structure
```
.
├──  serverless.yml 
├── resources # Contains serverless template for required resources
├── src
│   ├── [function-name]
│   │   ├── index.ts    # handler function
│   │   ├──  tests      # Unit tests
│   │   ├──  schemas    # Joi validation schema
│   │   ├──  types      # function types
├── package.json
├── tsconfig.json            # Typescript compiler configuration
├── jest.config.js           # Jest configuration file
├── buildspec.yml            # buildspec file for aws code build (deploy)
├── testspec.yml             # testspec file for aws code build test stage
```
## CI/CD

The ci/cd setup has been done using AWS Code Build and Code Pipeline.
pipeline get triggered on each new commit in **main** branch:

The pipeline has two stages
- **Test**: run unit tests
```yaml
    version: 0.2
    run-as: root
    phases:
      install:
        runtime-versions:
          nodejs: latest
        commands:
          - npm ci
      build:
        commands:
          - npm run test
    cache:
      paths:
        - node_modules
```

- **Deploy**: deploy (serverless deploy)
```yaml
    version: 0.2
    run-as: root
    phases:
      install:
        runtime-versions:
          nodejs: latest
        commands:
          - npm install -g serverless
          - npm ci
      build:
        commands:
          - serverless deploy --stage ${STAGE_NAME}
      post_build:
        commands:
          - echo deployed successfully
    cache:
      paths:
        - node_modules
```

### Install 

1. clone repo
2. npm install (sls dynamodb install automatically run after npm i on first run)

#### Testing on Local

```bash 
npm run dev
```

#### Unit Test

```bash 
npm run test
```
```bash 
npm run test:coverage
```

#### lint

```bash 
npm run eslint
```
```bash 
npm run eslint:fix
```

### Tech
 - TypeScript 
 - Nodejs
 - Serverless Framework
 - AWS
