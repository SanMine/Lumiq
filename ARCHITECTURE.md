# LUMIQ - Software Architecture Documentation

This document provides detailed software architecture diagrams and explanations for the LUMIQ platform, covering all layers from presentation to data persistence.

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Layered Architecture](#layered-architecture)
3. [Component Architecture](#component-architecture)
4. [Data Architecture](#data-architecture)
5. [Security Architecture](#security-architecture)
6. [Deployment Architecture](#deployment-architecture)
7. [Integration Architecture](#integration-architecture)

---

## System Architecture Overview

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser<br/>Chrome, Firefox, Safari, Edge]
        Mobile[Mobile Browser<br/>iOS Safari, Android Chrome]
    end
    
    subgraph "CDN Layer (Future)"
        CDN[Content Delivery Network<br/>Static Assets]
    end
    
    subgraph "Application Layer"
        LB[Load Balancer<br/>NGINX/ALB]
        
        subgraph "Frontend Tier"
            FE1[React App Instance 1<br/>Port 5173]
            FE2[React App Instance 2<br/>Port 5174]
            FE3[React App Instance N<br/>Port 517X]
        end
        
        subgraph "Backend Tier"
            BE1[Express Server 1<br/>Port 5001]
            BE2[Express Server 2<br/>Port 5002]
            BE3[Express Server N<br/>Port 500X]
        end
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB<br/>Primary)]
        MongoReplica[(MongoDB<br/>Replica Set)]
        Redis[(Redis Cache<br/>Future)]
    end
    
    subgraph "External Services"
        GROQ[GROQ AI API<br/>Llama 3.3 70B]
        Email[Email Service<br/>SendGrid/AWS SES]
        Storage[Object Storage<br/>AWS S3/CloudFlare R2]
    end
    
    Browser --> LB
    Mobile --> LB
    LB --> FE1
    LB --> FE2
    LB --> FE3
    
    FE1 --> BE1
    FE2 --> BE2
    FE3 --> BE3
    
    BE1 --> MongoDB
    BE2 --> MongoDB
    BE3 --> MongoDB
    
    MongoDB --> MongoReplica
    
    BE1 -.-> Redis
    BE2 -.-> Redis
    BE3 -.-> Redis
    
    BE1 --> GROQ
    BE2 --> Email
    BE3 --> Storage
    
    CDN -.-> FE1
```

---

## Layered Architecture

### 1. Seven-Layer Architecture Diagram

```mermaid
graph TB
    subgraph "Layer 1: Presentation Layer"
        UI[React Components<br/>TypeScript + Tailwind CSS]
        Pages[Pages Router<br/>React Router v7]
        State[State Management<br/>Context API]
    end
    
    subgraph "Layer 2: Client Business Logic"
        Hooks[Custom Hooks<br/>useAuth, useTheme]
        Utils[Utility Functions<br/>Formatters, Validators]
        API[API Client<br/>Axios with Interceptors]
    end
    
    subgraph "Layer 3: API Gateway Layer"
        Routes[Express Routes<br/>13 Route Handlers]
        Middleware[Middleware Stack<br/>CORS, Auth, Validation]
        ErrorHandler[Error Handler<br/>Centralized Error Management]
    end
    
    subgraph "Layer 4: Service Layer"
        AIService[AI Matching Service<br/>GROQ Integration]
        RoomService[Room Service<br/>Reservation Logic]
        CounterService[Counter Service<br/>ID Generation]
        RatingService[Rating Service<br/>Aggregate Calculations]
    end
    
    subgraph "Layer 5: Data Access Layer"
        Models[Mongoose Models<br/>11 Schema Definitions]
        ODM[Mongoose ODM<br/>Query Builder]
        Validators[Schema Validators<br/>Data Integrity]
    end
    
    subgraph "Layer 6: Database Layer"
        MongoDB[(MongoDB Database<br/>Collections + Indexes)]
        Transactions[Transactions<br/>ACID Operations]
    end
    
    subgraph "Layer 7: External Integration Layer"
        GroqAPI[GROQ AI API]
        FileStorage[File System<br/>Multer Uploads]
        Future[Future: Email, SMS, Payment]
    end
    
    UI --> Hooks
    Pages --> API
    State --> API
    
    API --> Routes
    Routes --> Middleware
    Middleware --> ErrorHandler
    
    Routes --> AIService
    Routes --> RoomService
    Routes --> CounterService
    Routes --> RatingService
    
    AIService --> Models
    RoomService --> Models
    CounterService --> Models
    RatingService --> Models
    
    Models --> ODM
    ODM --> Validators
    Validators --> MongoDB
    
    MongoDB --> Transactions
    
    AIService --> GroqAPI
    Routes --> FileStorage
    Routes -.-> Future
```

### 2. Request Processing Flow

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant R as Router
    participant MW as Middleware
    participant Ctrl as Route Handler
    participant Svc as Service Layer
    participant Model as Mongoose Model
    participant DB as MongoDB
    participant Ext as External API
    
    C->>R: HTTP Request + JWT
    R->>MW: Forward to Middleware
    
    MW->>MW: CORS Check
    MW->>MW: Parse JSON
    MW->>MW: Verify JWT Token
    MW->>MW: Extract User from JWT
    MW->>MW: RBAC Check (requireAuth)
    
    alt Authentication Failed
        MW-->>C: 401 Unauthorized
    else Authentication Success
        MW->>Ctrl: Authenticated Request + user object
        
        Ctrl->>Ctrl: Validate Input
        
        alt Service Required
            Ctrl->>Svc: Call Business Logic
            Svc->>Model: Query/Modify Data
            Model->>DB: Execute Query
            DB-->>Model: Result
            Model-->>Svc: Processed Data
            
            opt External Service Needed
                Svc->>Ext: API Call (GROQ, etc.)
                Ext-->>Svc: Response
            end
            
            Svc-->>Ctrl: Service Result
        else Direct Model Access
            Ctrl->>Model: Query Data
            Model->>DB: Execute Query
            DB-->>Model: Result
            Model-->>Ctrl: Data
        end
        
        Ctrl->>Ctrl: Format Response
        Ctrl-->>C: JSON Response
    end
```

---

## Component Architecture

### 1. Frontend Component Hierarchy

```mermaid
graph TB
    subgraph "Root Component"
        App[App.tsx<br/>Router Provider + Auth Context]
    end
    
    subgraph "Layout Components"
        RootLayout[Root Layout<br/>Navbar + Footer]
        AuthLayout[Auth Layout<br/>Login/Signup wrapper]
        AdminLayout[Admin Layout<br/>Sidebar + Header]
    end
    
    subgraph "Page Components"
        subgraph "Student Pages"
            Home[Home Page]
            AllDorms[All Dorms Page]
            DormDetail[Dorm Detail Page]
            RoomBooking[Room Booking Page]
            Roommates[Roommates Page]
            KnockKnock[Knock-Knock Page]
            Connection[Connection Page]
            MyAccount[My Account Page]
        end
        
        subgraph "Admin Pages"
            Overview[Overview Dashboard]
            MyDorms[My Dorms Management]
            Rooms[Rooms Management]
            Bookings[Bookings Management]
            Analytics[Analytics Dashboard]
            Settings[Admin Settings]
        end
        
        subgraph "Auth Pages"
            Login[Login Page]
            Signup[Signup Page]
        end
    end
    
    subgraph "Shared Components"
        Navbar[Navbar<br/>Theme Toggle + Notifications]
        Footer[Footer<br/>Links + Info]
        Notifications[Notifications Panel<br/>Dropdown List]
        FloatingChat[Floating Chat Widget<br/>Minimizable]
        Loader[Loader Component<br/>Spinning Animation]
        Logo[Logo Component<br/>SVG Icon]
    end
    
    subgraph "UI Components (shadcn/ui)"
        Card[Card Components]
        Button[Button Variants]
        Input[Input Fields]
        Badge[Status Badges]
        Dialog[Modal Dialogs]
        Dropdown[Dropdown Menus]
    end
    
    subgraph "Context Providers"
        AuthContext[Auth Context<br/>User + Token State]
        ThemeContext[Theme Context<br/>Light/Dark Mode]
    end
    
    App --> AuthContext
    App --> ThemeContext
    App --> RootLayout
    App --> AuthLayout
    App --> AdminLayout
    
    RootLayout --> Navbar
    RootLayout --> Home
    RootLayout --> AllDorms
    RootLayout --> Footer
    
    AdminLayout --> Overview
    AdminLayout --> MyDorms
    
    Navbar --> Notifications
    
    Connection --> FloatingChat
    
    AllDorms --> Card
    AllDorms --> Button
```

### 2. Backend Component Architecture

```mermaid
graph TB
    subgraph "Entry Point"
        Index[index.js<br/>Server Bootstrap]
    end
    
    subgraph "Core Express App"
        ExpressApp[Express Application<br/>Middleware Configuration]
    end
    
    subgraph "Middleware Layer"
        CORS[CORS Middleware<br/>Origin Whitelist]
        Morgan[Morgan Logger<br/>HTTP Request Logging]
        BodyParser[JSON Parser<br/>Request Body Parsing]
        AuthMW[Auth Middleware<br/>JWT Verification]
        RBAC[RBAC Middleware<br/>Role Checking]
    end
    
    subgraph "Route Controllers (13)"
        AuthRoute[auth.js<br/>Signup/Signin]
        UsersRoute[users.js<br/>Profile Management]
        DormsRoute[dorms.js<br/>Dorm CRUD + Shared Suggestions]
        RoomsRoute[rooms.js<br/>Room CRUD + Reservation]
        BookingsRoute[bookings.js<br/>Booking CRUD with RBAC]
        PersonalityRoute[personalities.js<br/>Profile CRUD]
        MatchingRoute[matching.js<br/>Find Matches + AI Analysis]
        KnocksRoute[knocks.js<br/>Send/Accept/Reject]
        NotifRoute[notifications.js<br/>CRUD + Read Status]
        WishlistRoute[wishlist.js<br/>Favorites]
        AnalyticsRoute[analytics.js<br/>Dashboard Stats]
        PreferredRoute[preferred_roommate.js<br/>Preferences]
        ConvoRoute[conversations.js<br/>Chat Conversations]
        MsgRoute[messages.js<br/>Chat Messages]
        ChatSessionRoute[chat-sessions.js<br/>Active Session Tracking]
        HealthRoute[health.js<br/>Health Check]
    end
    
    subgraph "Service Layer (4)"
        AIMatchSvc[aiMatchingService.js<br/>GROQ API Integration]
        RoomSvc[roomService.js<br/>Reservation Logic]
        CounterSvc[counterService.js<br/>Auto-increment IDs]
        RatingSvc[ratingService.js<br/>Rating Calculations]
    end
    
    subgraph "Data Models (11)"
        UserModel[User.js]
        DormModel[Dorm.js]
        RoomModel[Room.js]
        BookingModel[Booking.js]
        PersonalityModel[Personality.js]
        KnockModel[Knock.js]
        NotifModel[Notification.js]
        WishlistModel[Wishlist.js]
        AIMatchModel[AiMatchResult.js]
        PreferredModel[Preferred_roommate.js]
        CounterModel[Counter.js]
        ConvoModel[Conversation.js]
        MsgModel[Message.js]
        RatingModel[Rating.js]
        ChatSessionModel[ChatSession.js]
    end
    
    Index --> ExpressApp
    ExpressApp --> CORS
    ExpressApp --> Morgan
    ExpressApp --> BodyParser
    
    ExpressApp --> AuthRoute
    ExpressApp --> DormsRoute
    
    DormsRoute --> AuthMW
    AuthMW --> RBAC
    
    DormsRoute --> DormModel
    DormsRoute --> RoomSvc
    DormsRoute --> RatingSvc
    
    MatchingRoute --> AIMatchSvc
    AIMatchSvc --> AIMatchModel
    
    RoomsRoute --> RoomSvc
    RoomSvc --> RoomModel
    
    BookingsRoute --> BookingModel
    BookingsRoute --> RoomSvc
```

---

## Data Architecture

### 1. Database Schema Architecture

```mermaid
erDiagram
    USERS ||--o{ PERSONALITIES : "has"
    USERS ||--o{ BOOKINGS : "makes"
    USERS ||--o{ DORMS : "manages (admin)"
    USERS ||--o{ KNOCKS : "sends"
    USERS ||--o{ KNOCKS : "receives"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ WISHLISTS : "creates"
    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ PREFERRED_ROOMMATE : "has preferences"
    USERS ||--o{ RATINGS : "creates"
    USERS ||--o{ CONVERSATIONS : "participates"
    
    DORMS ||--o{ ROOMS : "contains"
    DORMS ||--o{ BOOKINGS : "receives"
    DORMS ||--o{ RATINGS : "receives"
    
    ROOMS ||--o{ BOOKINGS : "has"
    
    PERSONALITIES ||--o{ AI_MATCH_RESULTS : "analyzed"
    
    CONVERSATIONS ||--o{ MESSAGES : "contains"
    CONVERSATIONS ||--o{ CHAT_SESSIONS : "has active sessions"
    
    USERS {
        int _id PK
        string email UNIQUE
        string password
        string name
        string role
        int dormId FK
        string phone
        date dateOfBirth
        string bio
        date createdAt
    }
    
    DORMS {
        int _id PK
        string name
        string location
        object address
        float latitude
        float longitude
        int price
        array facilities
        array images
        int admin_id FK
        float Water_fee
        string waterBillingType
        float Electricity_fee
        string electricityBillingType
        float insurance_policy
        boolean isActive
        object contactInfo
        object operatingHours
    }
    
    ROOMS {
        string _id PK
        int dormId FK
        string room_number
        int floor
        string room_type
        int capacity
        float price_per_month
        string status
        array amenities
        int currentOccupantId FK
        date moveInDate
        date moveOutDate
        string zone
        string bedType
        float size
    }
    
    BOOKINGS {
        int _id PK
        int userId FK
        int dormId FK
        string roomId FK
        date moveInDate
        int stayDuration
        string durationType
        string paymentMethod
        string paymentSlipUrl
        float bookingFeePaid
        float totalAmount
        string status
        date createdAt
    }
    
    PERSONALITIES {
        int _id PK
        int userId FK
        string nickname
        int age
        string gender
        string nationality
        string sleep_type
        array lifestyle
        string study_habits
        string cleanliness
        string social
        string MBTI
        string going_out
        boolean smoking
        string drinking
        string pets
        string noise_tolerance
        string temperature
    }
    
    KNOCKS {
        int _id PK
        int senderId FK
        int recipientId FK
        string status
        date createdAt
    }
    
    NOTIFICATIONS {
        int _id PK
        int recipientId FK
        string type
        string title
        string message
        boolean read
        object data
        date createdAt
    }
    
    WISHLISTS {
        int _id PK
        int userId FK
        int dormId FK
        date createdAt
    }
    
    AI_MATCH_RESULTS {
        int _id PK
        int userId1 FK
        int userId2 FK
        object analysis
        date analyzedAt
        date expiresAt
    }
    
    PREFERRED_ROOMMATE {
        int _id PK
        int userId FK
        object preferred_price_range
        string preferred_location
        array preferred_amenities
        date createdAt
    }
    
    CONVERSATIONS {
        int _id PK
        array participants
        string lastMessage
        date lastMessageAt
    }
    
    MESSAGES {
        int _id PK
        int conversationId FK
        object sender
        string text
        array readBy
        date createdAt
    }
    
    RATINGS {
        int _id PK
        int userId FK
        int dormId FK
        float rating
        string comment
        date createdAt
    }
    
    CHAT_SESSIONS {
        int _id PK
        int userId FK
        int conversationId FK
        date createdAt
    }
```

### 2. Data Flow Architecture

```mermaid
graph LR
    subgraph "Data Sources"
        UserInput[User Input Forms]
        FileUpload[File Uploads]
        AIGenerated[AI Generated Data]
    end
    
    subgraph "Data Validation"
        ClientVal[Client-side Validation<br/>React Hook Form]
        ServerVal[Server-side Validation<br/>Mongoose Validators]
    end
    
    subgraph "Data Processing"
        Transform[Data Transformation<br/>Format, Calculate, Sanitize]
        Hash[Password Hashing<br/>bcrypt]
        IDGen[ID Generation<br/>Counter Service]
    end
    
    subgraph "Data Persistence"
        MongoDB[(MongoDB<br/>Collections)]
        FileSystem[(File System<br/>/uploads)]
        Cache[(Cache Layer<br/>Future: Redis)]
    end
    
    subgraph "Data Retrieval"
        Query[Mongoose Queries<br/>Find, Aggregate]
        Populate[Population<br/>Join-like operations]
        Index[Index Optimization<br/>_id, email, userId]
    end
    
    subgraph "Data Presentation"
        API[REST API Response<br/>JSON Format]
        PDF[PDF Generation<br/>Invoice]
        Download[File Download<br/>Images, Documents]
    end
    
    UserInput --> ClientVal
    FileUpload --> ClientVal
    
    ClientVal --> ServerVal
    ServerVal --> Transform
    
    Transform --> Hash
    Transform --> IDGen
    
    Hash --> MongoDB
    IDGen --> MongoDB
    FileUpload --> FileSystem
    AIGenerated --> MongoDB
    
    MongoDB --> Query
    Query --> Populate
    Populate --> Index
    
    Index --> API
    MongoDB --> PDF
    FileSystem --> Download
    
    API --> Cache
```

---

## Security Architecture

### 1. Security Layers

```mermaid
graph TB
    subgraph "Layer 1: Network Security"
        HTTPS[HTTPS/TLS<br/>Encrypted Transport]
        CORS[CORS Policy<br/>Origin Whitelist]
        RateLimit[Rate Limiting<br/>DDoS Protection]
    end
    
    subgraph "Layer 2: Authentication"
        JWT[JWT Tokens<br/>Stateless Auth]
        TokenGen[Token Generation<br/>HS256 Algorithm]
        TokenVerify[Token Verification<br/>Middleware]
        TokenExpiry[Token Expiration<br/>Configurable TTL]
    end
    
    subgraph "Layer 3: Authorization (RBAC)"
        RoleCheck[Role Verification<br/>student/dorm_admin/admin]
        OwnershipCheck[Resource Ownership<br/>Verify User Owns Data]
        DormOwnership[Dorm Ownership Check<br/>admin_id verification]
    end
    
    subgraph "Layer 4: Data Security"
        PasswordHash[Password Hashing<br/>bcrypt + salt]
        InputSanitize[Input Sanitization<br/>Prevent Injection]
        DataValidation[Data Validation<br/>Mongoose Schemas]
        XSSProtection[XSS Prevention<br/>React Auto-escaping]
    end
    
    subgraph "Layer 5: API Security"
        AuthHeader[Authorization Header<br/>Bearer Token]
        APIValidation[Request Validation<br/>Schema Checking]
        ErrorMasking[Error Masking<br/>Hide Sensitive Info]
    end
    
    subgraph "Layer 6: Database Security"
        NoSQLInjection[NoSQL Injection Prevention<br/>Parameterized Queries]
        IndexSecurity[Indexed Unique Fields<br/>email uniqueness]
        ConnectionSecurity[Secure Connection<br/>MongoDB Auth]
    end
    
    HTTPS --> JWT
    CORS --> JWT
    RateLimit --> JWT
    
    JWT --> TokenGen
    TokenGen --> TokenVerify
    TokenVerify --> TokenExpiry
    
    TokenExpiry --> RoleCheck
    RoleCheck --> OwnershipCheck
    OwnershipCheck --> DormOwnership
    
    DormOwnership --> PasswordHash
    PasswordHash --> InputSanitize
    InputSanitize --> DataValidation
    DataValidation --> XSSProtection
    
    XSSProtection --> AuthHeader
    AuthHeader --> APIValidation
    APIValidation --> ErrorMasking
    
    ErrorMasking --> NoSQLInjection
    NoSQLInjection --> IndexSecurity
    IndexSecurity --> ConnectionSecurity
```

### 2. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant AuthRoute
    participant JWT
    participant DB
    participant ProtectedRoute
    participant RBAC
    
    User->>Client: Enter Credentials
    Client->>AuthRoute: POST /auth/signin
    AuthRoute->>DB: Find User by Email
    DB-->>AuthRoute: User Data
    
    AuthRoute->>AuthRoute: Compare Password (bcrypt)
    
    alt Password Match
        AuthRoute->>JWT: Generate Token
        JWT->>JWT: Sign with Secret Key
        JWT-->>AuthRoute: JWT Token
        AuthRoute-->>Client: {token, user}
        Client->>Client: Store Token in localStorage
        Client->>Client: Set Axios Header
        
        Client->>ProtectedRoute: GET /api/bookings<br/>Authorization: Bearer {token}
        ProtectedRoute->>JWT: Verify Token
        JWT->>JWT: Check Signature
        JWT->>JWT: Check Expiration
        
        alt Token Valid
            JWT-->>ProtectedRoute: Decoded Payload {userId, role}
            ProtectedRoute->>RBAC: Check Role Permissions
            
            alt Role = dorm_admin
                RBAC->>DB: Find admin's dorms
                DB-->>RBAC: Dorm IDs
                RBAC->>DB: Filter bookings by dormIds
                DB-->>RBAC: Filtered Bookings
                RBAC-->>Client: Authorized Data
            else Role = admin
                RBAC->>DB: Get All Bookings
                DB-->>RBAC: All Bookings
                RBAC-->>Client: All Data
            else Role = student
                RBAC->>DB: Get User's Bookings
                DB-->>RBAC: User Bookings
                RBAC-->>Client: User Data
            end
        else Token Invalid
            JWT-->>Client: 401 Unauthorized
        end
    else Password Mismatch
        AuthRoute-->>Client: 401 Invalid Credentials
    end
```

---

## Deployment Architecture

### 1. Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        subgraph "Frontend Dev"
            VSCode1[VS Code<br/>Port 5173]
            Vite[Vite Dev Server<br/>HMR Enabled]
            ReactDev[React Dev Tools]
        end
        
        subgraph "Backend Dev"
            VSCode2[VS Code<br/>Port 5001]
            Nodemon[Nodemon<br/>Auto-restart]
            Morgan[Morgan Logger<br/>Console Output]
        end
        
        LocalMongo[(Local MongoDB<br/>Port 27017)]
        EnvFile[.env Files<br/>Local Config]
    end
    
    subgraph "External Dev Services"
        GroqDev[GROQ API<br/>Development Key]
        DBAtlas[(MongoDB Atlas<br/>Dev Cluster)]
    end
    
    VSCode1 --> Vite
    Vite --> ReactDev
    VSCode2 --> Nodemon
    Nodemon --> Morgan
    
    Nodemon --> LocalMongo
    Nodemon --> EnvFile
    Nodemon --> GroqDev
    
    Vite -.Alternative.-> DBAtlas
```

### 2. Production Deployment Architecture

```mermaid
graph TB
    subgraph "Client Access"
        Users[End Users<br/>Global]
        DNS[DNS<br/>Route 53/Cloudflare]
    end
    
    subgraph "Edge Layer"
        CDN[CloudFront CDN<br/>Static Assets Cache]
        WAF[Web Application Firewall<br/>DDoS Protection]
    end
    
    subgraph "Load Balancing"
        ALB[Application Load Balancer<br/>HTTPS Termination]
        TargetGroup[Target Group<br/>Health Checks]
    end
    
    subgraph "Application Tier - Auto Scaling Group"
        subgraph "Availability Zone 1"
            FE1[Frontend Container<br/>NGINX + React Build]
            BE1[Backend Container<br/>Node.js + Express]
        end
        
        subgraph "Availability Zone 2"
            FE2[Frontend Container<br/>NGINX + React Build]
            BE2[Backend Container<br/>Node.js + Express]
        end
    end
    
    subgraph "Database Tier"
        Primary[(MongoDB Primary<br/>AWS DocumentDB)]
        Replica1[(Replica 1)]
        Replica2[(Replica 2)]
    end
    
    subgraph "Cache Tier"
        Redis1[(Redis Master)]
        Redis2[(Redis Slave)]
    end
    
    subgraph "Storage Tier"
        S3[S3 Bucket<br/>Images + Documents]
        Backup[S3 Glacier<br/>Database Backups]
    end
    
    subgraph "Monitoring & Logging"
        CloudWatch[CloudWatch<br/>Logs + Metrics]
        SNS[SNS Alerts<br/>Email Notifications]
    end
    
    subgraph "External Services"
        GroqProd[GROQ API<br/>Production Key]
        EmailSvc[SendGrid<br/>Email Service]
    end
    
    Users --> DNS
    DNS --> CDN
    CDN --> WAF
    WAF --> ALB
    ALB --> TargetGroup
    
    TargetGroup --> FE1
    TargetGroup --> FE2
    TargetGroup --> BE1
    TargetGroup --> BE2
    
    FE1 --> BE1
    FE2 --> BE2
    
    BE1 --> Redis1
    BE2 --> Redis1
    Redis1 --> Redis2
    
    BE1 --> Primary
    BE2 --> Primary
    Primary --> Replica1
    Primary --> Replica2
    
    BE1 --> S3
    BE2 --> S3
    Primary --> Backup
    
    BE1 --> CloudWatch
    BE2 --> CloudWatch
    CloudWatch --> SNS
    
    BE1 --> GroqProd
    BE2 --> EmailSvc
```

### 3. CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        Dev[Developer<br/>Local Machine]
        Git[Git Commit]
        GitHub[GitHub Repository<br/>Main Branch]
    end
    
    subgraph "CI Pipeline - GitHub Actions"
        Trigger[Workflow Trigger<br/>on push]
        Checkout[Checkout Code]
        
        subgraph "Frontend Pipeline"
            FEInstall[npm install frontend]
            FELint[ESLint Check]
            FEBuild[Vite Build]
            FETest[Unit Tests]
        end
        
        subgraph "Backend Pipeline"
            BEInstall[npm install backend]
            BELint[ESLint Check]
            BETest[Unit Tests]
        end
    end
    
    subgraph "CD Pipeline"
        BuildImage[Build Docker Images]
        PushECR[Push to ECR<br/>Container Registry]
        UpdateECS[Update ECS Service<br/>Rolling Deployment]
    end
    
    subgraph "Deployment"
        ECS[AWS ECS/Fargate<br/>Container Orchestration]
        Health[Health Check]
        Rollback{Deployment<br/>Success?}
    end
    
    subgraph "Notification"
        Slack[Slack Notification<br/>Deployment Status]
        Email[Email Alert<br/>If Failed]
    end
    
    Dev --> Git
    Git --> GitHub
    GitHub --> Trigger
    Trigger --> Checkout
    
    Checkout --> FEInstall
    Checkout --> BEInstall
    
    FEInstall --> FELint --> FEBuild --> FETest
    BEInstall --> BELint --> BETest
    
    FETest --> BuildImage
    BETest --> BuildImage
    
    BuildImage --> PushECR
    PushECR --> UpdateECS
    UpdateECS --> ECS
    ECS --> Health
    Health --> Rollback
    
    Rollback -->|Success| Slack
    Rollback -->|Failure| Email
    Email --> Rollback
```

---

## Integration Architecture

### 1. External Service Integration

```mermaid
graph TB
    subgraph "LUMIQ Backend"
        API[Express API Server]
    end
    
    subgraph "AI Service Integration"
        AIService[AI Matching Service]
        GroqSDK[GROQ SDK<br/>JavaScript Client]
        GroqAPI[GROQ Cloud API<br/>Llama 3.3 70B]
        
        AIService --> GroqSDK
        GroqSDK -->|HTTPS POST| GroqAPI
        GroqAPI -->|JSON Response| GroqSDK
    end
    
    subgraph "File Storage Integration"
        Multer[Multer Middleware]
        LocalFS[Local File System<br/>/uploads]
        S3Client[AWS S3 SDK<br/>Future]
        S3Bucket[S3 Bucket<br/>Production]
        
        Multer -->|Dev| LocalFS
        Multer -->|Prod| S3Client
        S3Client --> S3Bucket
    end
    
    subgraph "Email Service Integration (Future)"
        EmailSvc[Email Service]
        SendGrid[SendGrid API]
        SES[AWS SES]
        
        EmailSvc -->|Option 1| SendGrid
        EmailSvc -->|Option 2| SES
    end
    
    subgraph "Payment Gateway Integration (Future)"
        PaymentSvc[Payment Service]
        Stripe[Stripe API]
        Omise[Omise API<br/>Thai Payment]
        
        PaymentSvc -->|International| Stripe
        PaymentSvc -->|Thailand| Omise
    end
    
    subgraph "Third-party APIs"
        QRServer[QR Server API<br/>PromptPay QR Generation]
        DicebearAPI[Dicebear API<br/>Avatar Generation]
        
        API --> QRServer
        API --> DicebearAPI
    end
    
    API --> AIService
    API --> Multer
    API -.Future.-> EmailSvc
    API -.Future.-> PaymentSvc
```

### 2. API Integration Patterns

```mermaid
graph TB
    subgraph "Synchronous Integration"
        SyncRequest[Client Request]
        SyncAPI[API Call to External Service]
        SyncWait[Wait for Response]
        SyncReturn[Return to Client]
        
        SyncRequest --> SyncAPI
        SyncAPI --> SyncWait
        SyncWait --> SyncReturn
    end
    
    subgraph "Asynchronous Integration (Future)"
        AsyncRequest[Client Request]
        QueueJob[Queue Background Job]
        ReturnImmediate[Return Job ID]
        Worker[Worker Process Job]
        Callback[Webhook/Polling]
        
        AsyncRequest --> QueueJob
        QueueJob --> ReturnImmediate
        QueueJob --> Worker
        Worker --> Callback
    end
    
    subgraph "Caching Strategy"
        CacheRequest[API Request]
        CheckCache{Cache<br/>Available?}
        ReturnCache[Return Cached Data]
        FetchAPI[Fetch from API]
        UpdateCache[Update Cache]
        ReturnFresh[Return Fresh Data]
        
        CacheRequest --> CheckCache
        CheckCache -->|Hit| ReturnCache
        CheckCache -->|Miss| FetchAPI
        FetchAPI --> UpdateCache
        UpdateCache --> ReturnFresh
    end
    
    subgraph "Error Handling"
        APICall[API Call]
        TryCatch{Try/Catch}
        Success[Success Response]
        Error[Error Occurred]
        Retry{Retry<br/>Logic}
        Fallback[Fallback Response]
        LogError[Log Error]
        
        APICall --> TryCatch
        TryCatch -->|Success| Success
        TryCatch -->|Error| Error
        Error --> Retry
        Retry -->|Yes| APICall
        Retry -->|No| Fallback
        Fallback --> LogError
    end
```

---

## Performance Architecture

### 1. Performance Optimization Strategy

```mermaid
graph TB
    subgraph "Frontend Performance"
        CodeSplit[Code Splitting<br/>React.lazy]
        LazyLoad[Lazy Loading<br/>Images + Components]
        Memoization[Memoization<br/>useMemo, useCallback]
        VirtualScroll[Virtual Scrolling<br/>Large Lists]
        
        CodeSplit --> LazyLoad
        LazyLoad --> Memoization
        Memoization --> VirtualScroll
    end
    
    subgraph "Backend Performance"
        QueryOpt[Query Optimization<br/>Mongoose Lean]
        Indexing[Database Indexing<br/>_id, email, userId]
        Pagination[Pagination<br/>Limit + Skip]
        AsyncOps[Async Operations<br/>Non-blocking I/O]
        
        QueryOpt --> Indexing
        Indexing --> Pagination
        Pagination --> AsyncOps
    end
    
    subgraph "Network Performance"
        Compression[Gzip Compression<br/>Response Bodies]
        CDN2[CDN Caching<br/>Static Assets]
        HTTPCache[HTTP Caching<br/>Cache-Control Headers]
        
        Compression --> CDN2
        CDN2 --> HTTPCache
    end
    
    subgraph "Caching Strategy"
        ClientCache[Client-side Cache<br/>localStorage]
        ServerCache[Server-side Cache<br/>Redis Future]
        DBCache[Database Cache<br/>MongoDB Cache]
        
        ClientCache --> ServerCache
        ServerCache --> DBCache
    end
    
    VirtualScroll --> Compression
    AsyncOps --> ClientCache
```

---

## Summary

This architecture documentation provides comprehensive diagrams covering:

✅ **System Architecture** - High-level multi-tier architecture with load balancing
✅ **Layered Architecture** - Seven distinct layers from presentation to external services
✅ **Component Architecture** - Frontend and backend component hierarchies
✅ **Data Architecture** - Complete ER diagram with 14 collections and data flow
✅ **Security Architecture** - Six-layer security model with authentication flow
✅ **Deployment Architecture** - Development and production environments with CI/CD
✅ **Integration Architecture** - External service integration patterns
✅ **Performance Architecture** - Optimization strategies across all layers

Each diagram uses Mermaid format for clear visualization and can be rendered in any compatible viewer.
