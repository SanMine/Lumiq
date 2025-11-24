graph TB
    %% ============================================================================
    %% LUMIQ PLATFORM - DETAILED C4 ARCHITECTURE DIAGRAM
    %% Based on README.md High-Level Architecture Overview
    %% ============================================================================

    %% 1. CLIENT LAYER
    subgraph ClientLayer ["1. CLIENT LAYER"]
        Browser["<b>Web Browser</b><br/>(Chrome, Firefox, Safari, Edge)<br/>"]
    end

    %% 2. PRESENTATION LAYER
    subgraph PresentationLayer ["2. PRESENTATION LAYER"]
        direction TB
        WebApp["<b>React 18 + TypeScript Frontend</b><br/><i>Built with Vite</i><br/><br/><b>Pages:</b> Home, Dorms, Rooms, Profile, Admin<br/><b>Components:</b> shadcn/ui, Radix UI, Forms, Modals<br/><b>State:</b> React Context API<br/><b>Routing:</b> React Router v7<br/><b>Client:</b> Axios"]
    end

    %% 3. APPLICATION LAYER
    subgraph AppLayer ["3. APPLICATION LAYER"]
        direction TB
        Backend["<b>Express.js 5 Backend Server</b><br/>Node.js 18+ Runtime<br/>"]
        
        subgraph MiddlewareStack ["Middleware Stack"]
            MW["CORS → Morgan Logger → JSON Parser → Auth (JWT/RBAC)"]
        end
        
        subgraph APIRoutes ["API Routes (Controllers)"]
            RoutesPublic["<b>Public Endpoints</b><br/>/auth (Signup/Signin)<br/>/dorms (Read Only)<br/>/health"]
            RoutesProtected["<b>Protected Endpoints</b><br/>/users (Profile)<br/>/bookings, /knocks<br/>/match, /notifications"]
            RoutesAdmin["<b>Admin Endpoints</b><br/>/dorms (Create/Edit)<br/>/rooms (Manage)<br/>/analytics"]
        end
    end

    %% 4. BUSINESS LOGIC LAYER
    subgraph BusinessLayer ["4. BUSINESS LOGIC LAYER"]
        direction TB
        ServiceAI["<b>AI Matching Service</b><br/>• Personality Analysis<br/>• Compatibility Scoring<br/>• GROQ Integration"]
        ServiceRoom["<b>Room Service</b><br/>• Reservations<br/>• Availability Tracking<br/>• Move-in/Move-out"]
        ServiceNotify["<b>Notification Service</b><br/>• Real-time Alerts<br/>• Booking Updates"]
        ServiceCounter["<b>Counter Service</b><br/>• Auto-increment IDs"]
    end

    %% 5. DATA ACCESS LAYER
    subgraph DataAccessLayer ["5. DATA ACCESS LAYER"]
        Mongoose["<b>Mongoose ODM</b><br/>Data Models & Validation<br/><br/><b>Core Models:</b> User, Dorm, Room, Booking<br/><b>Matching Models:</b> Personality, Knock, AiMatchResult<br/><b>System Models:</b> Notification, Wishlist, Counter"]
    end

    %% 6. DATABASE LAYER
    subgraph DatabaseLayer ["6. DATABASE LAYER"]
        MongoDB[("<b>MongoDB</b><br/>NoSQL Database<br/><br/><i>Collections:</i><br/>users, dorms, rooms, bookings,<br/>personalities, knocks, notifications")]
    end

    %% 7. EXTERNAL SERVICES
    subgraph ExternalLayer ["7. EXTERNAL SERVICES"]
        GroqAPI["<b>GROQ AI API</b><br/>Llama 3.3 70B Model<br/>(Personality Analysis)"]
    end

    %% ============================================================================
    %% DATA FLOW CONNECTIONS
    %% ============================================================================

    %% Client to Presentation
    Browser -->|HTTPS Requests<br/>JSON Payload| WebApp

    %% Presentation to Application
    WebApp -->|REST API Calls<br/>JWT Authorization Header| Backend

    %% Application Internal Flow
    Backend --> MW
    MW --> RoutesPublic
    MW --> RoutesProtected
    MW --> RoutesAdmin

    %% Application to Business Logic
    RoutesPublic --> ServiceRoom
    RoutesProtected --> ServiceAI
    RoutesProtected --> ServiceRoom
    RoutesProtected --> ServiceNotify
    RoutesAdmin --> ServiceRoom
    RoutesAdmin --> ServiceCounter

    %% Business Logic to External
    ServiceAI -.->|HTTPS / API Key| GroqAPI

    %% Business Logic to Data Access
    ServiceAI --> Mongoose
    ServiceRoom --> Mongoose
    ServiceNotify --> Mongoose
    ServiceCounter --> Mongoose

    %% Data Access to Database
    Mongoose -->|Read/Write BSON| MongoDB

    %% ============================================================================
    %% STYLING (Monochrome Professional)
    %% ============================================================================
    
    classDef subGraphStyle fill:#ffffff,stroke:#333333,stroke-width:2px,color:#000000
    classDef nodeStyle fill:#f2f2f2,stroke:#000000,stroke-width:1px,color:#000000,rx:5,ry:5
    classDef dbStyle fill:#e6e6e6,stroke:#000000,stroke-width:2px,color:#000000,shape:cylinder
    classDef externalStyle fill:#ffffff,stroke:#000000,stroke-width:2px,stroke-dasharray: 5 5,color:#000000

    %% Apply Styles
    class ClientLayer,PresentationLayer,AppLayer,BusinessLayer,DataAccessLayer,DatabaseLayer,ExternalLayer subGraphStyle
    class Browser,WebApp,Backend,MW,RoutesPublic,RoutesProtected,RoutesAdmin,ServiceAI,ServiceRoom,ServiceNotify,ServiceCounter,Mongoose nodeStyle
    class MongoDB dbStyle
    class GroqAPI externalStyle