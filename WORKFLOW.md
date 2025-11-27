# LUMIQ - System Workflow Documentation

This document provides detailed workflow diagrams for all major user journeys and system processes in the LUMIQ platform.

---

## Table of Contents

1. [Authentication Workflows](#authentication-workflows)
2. [Student User Workflows](#student-user-workflows)
3. [Dorm Admin Workflows](#dorm-admin-workflows)
4. [System Integration Flows](#system-integration-flows)

---

## Authentication Workflows

### 1. User Registration Flow

```mermaid
flowchart TD
    Start([User visits LUMIQ]) --> Landing[Landing Page]
    Landing --> ClickSignup[Click Sign Up]
    ClickSignup --> SignupForm[Sign Up Form]
    
    SignupForm --> EnterDetails[Enter Details:<br/>- Email<br/>- Password<br/>- Name<br/>- Role]
    EnterDetails --> SelectRole{Select Role}
    
    SelectRole -->|Student| StudentRole[Role: student]
    SelectRole -->|Dorm Admin| AdminRole[Role: dorm_admin]
    
    StudentRole --> SubmitForm[Submit Form]
    AdminRole --> SubmitForm
    
    SubmitForm --> ValidateInput{Frontend<br/>Validation}
    ValidateInput -->|Invalid| ShowError[Show Validation Error]
    ShowError --> SignupForm
    
    ValidateInput -->|Valid| SendRequest[POST /api/auth/signup]
    SendRequest --> BackendValidate{Backend<br/>Validation}
    
    BackendValidate -->|Email Exists| EmailError[Return Error:<br/>Email already registered]
    EmailError --> ShowError
    
    BackendValidate -->|Valid| HashPassword[Hash Password<br/>with bcrypt]
    HashPassword --> CreateUser[Create User in DB]
    CreateUser --> GenerateJWT[Generate JWT Token]
    GenerateJWT --> ReturnToken[Return Token + User Data]
    
    ReturnToken --> StoreToken[Store JWT in<br/>localStorage]
    StoreToken --> SetAuthContext[Update Auth Context]
    SetAuthContext --> RedirectHome[Redirect to Home]
    RedirectHome --> End([User Logged In])
```

### 2. User Login Flow

```mermaid
flowchart TD
    Start([User visits Login]) --> LoginForm[Sign In Form]
    LoginForm --> EnterCreds[Enter Credentials:<br/>- Email<br/>- Password]
    
    EnterCreds --> SubmitLogin[Submit Form]
    SubmitLogin --> FrontendCheck{Frontend<br/>Validation}
    
    FrontendCheck -->|Invalid| ShowError[Show Error Message]
    ShowError --> LoginForm
    
    FrontendCheck -->|Valid| SendRequest[POST /api/auth/signin]
    SendRequest --> FindUser{Find User<br/>by Email}
    
    FindUser -->|Not Found| UserNotFound[Error: User not found]
    UserNotFound --> ShowError
    
    FindUser -->|Found| ComparePassword{Compare Password<br/>with bcrypt}
    ComparePassword -->|Mismatch| WrongPassword[Error: Incorrect password]
    WrongPassword --> ShowError
    
    ComparePassword -->|Match| GenerateJWT[Generate JWT Token]
    GenerateJWT --> ReturnData[Return:<br/>- JWT Token<br/>- User Object]
    
    ReturnData --> StoreToken[Store JWT in localStorage]
    StoreToken --> SetAxiosHeader[Set Axios Default Header:<br/>Authorization: Bearer token]
    SetAxiosHeader --> UpdateContext[Update AuthContext]
    UpdateContext --> CheckRole{Check User Role}
    
    CheckRole -->|Student| StudentDash[Redirect to Home]
    CheckRole -->|Admin| AdminDash[Redirect to Admin Dashboard]
    
    StudentDash --> End([Logged In])
    AdminDash --> End
```

---

## Student User Workflows

### 3. Dorm Search & Booking Flow

```mermaid
flowchart TD
    Start([User on Home Page]) --> BrowseDorms[Click Browse Dorms]
    BrowseDorms --> AllDormsPage[All Dorms Page]
    
    AllDormsPage --> LoadDorms[GET /api/dorms]
    LoadDorms --> DisplayGrid[Display Dorms Grid]
    
    DisplayGrid --> UserAction{User Action}
    
    UserAction -->|Search| SearchInput[Enter Search Query]
    SearchInput --> FilterClient[Client-side Filter<br/>by name/location]
    FilterClient --> UpdateGrid[Update Display]
    UpdateGrid --> UserAction
    
    UserAction -->|Select Dorm| ViewDetails[Click Dorm Card]
    ViewDetails --> DormDetailPage[Dorm Detail Page]
    
    DormDetailPage --> FetchDetails[GET /api/dorms/:id]
    FetchDetails --> LoadRooms[GET /api/rooms?dormId=X]
    LoadRooms --> DisplayDetails[Display:<br/>- Images<br/>- Amenities<br/>- Rooms<br/>- Pricing]
    
    DisplayDetails --> SelectRoom{Select Room}
    SelectRoom -->|No rooms| ShowUnavailable[No Rooms Available]
    
    SelectRoom -->|Room Selected| BookButton[Click Book Now]
    BookButton --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| RedirectLogin[Redirect to Login<br/>with return URL]
    RedirectLogin --> LoginComplete[After Login]
    LoginComplete --> BookingPage
    
    CheckAuth -->|Yes| BookingPage[Room Booking Page]
    BookingPage --> LoadUserData[Load User Profile Data]
    LoadUserData --> PreFillForm[Pre-fill Form:<br/>- Name<br/>- Email<br/>- Phone]
    
    PreFillForm --> UserFillsForm[User Completes:<br/>- Move-in Date<br/>- Stay Duration<br/>- Payment Method]
    
    UserFillsForm --> ReviewPricing[Review Price Breakdown:<br/>- Room Price<br/>- Insurance<br/>- Utilities Est.<br/>- Booking Fee]
    
    ReviewPricing --> SelectPayment{Payment Method}
    
    SelectPayment -->|Card| CardDetails[Enter Card Details]
    SelectPayment -->|QR| ShowQR[Display PromptPay QR]
    SelectPayment -->|Slip| UploadSlip[Upload Payment Slip]
    
    CardDetails --> ConfirmBooking
    ShowQR --> ConfirmBooking
    UploadSlip --> ConfirmBooking
    
    ConfirmBooking[Click Confirm Booking] --> SubmitBooking[POST /api/bookings]
    
    SubmitBooking --> CreateBookingDB[Create Booking Record]
    CreateBookingDB --> ReserveRoom[Call RoomService.reserveRoom]
    
    ReserveRoom --> UpdateRoom{Room<br/>Available?}
    UpdateRoom -->|No| BookingPending[Status: Pending<br/>Manual confirmation needed]
    UpdateRoom -->|Yes| BookingConfirmed[Status: Confirmed<br/>Room Reserved]
    
    BookingConfirmed --> UpdateUserDorm[Update User.dormId]
    UpdateUserDorm --> NotifyAdmin[Create Notification<br/>for Dorm Admin]
    
    NotifyAdmin --> ShowSuccess[Show Success Dialog:<br/>- Booking ID<br/>- Amount Paid]
    BookingPending --> ShowSuccess
    
    ShowSuccess --> OfferInvoice{Download Invoice?}
    OfferInvoice -->|Yes| GeneratePDF[Generate PDF Invoice]
    OfferInvoice -->|No| RedirectAccount
    
    GeneratePDF --> DownloadPDF[Download PDF]
    DownloadPDF --> RedirectAccount[Redirect to My Account]
    RedirectAccount --> End([Booking Complete])
```

### 4. Roommate Matching & Connection Flow

```mermaid
flowchart TD
    Start([User Logged In]) --> RoommatesPage[Navigate to Roommates Page]
    
    RoommatesPage --> CheckProfile{Has Personality<br/>Profile?}
    
    CheckProfile -->|No| CreateProfile[Click Create Profile]
    CreateProfile --> ProfileForm[Personality Form]
    
    ProfileForm --> FillForm[Fill Details:<br/>- Nickname, Age, Gender<br/>- MBTI Type<br/>- Sleep Schedule<br/>- Study Habits<br/>- Cleanliness<br/>- Social Preference<br/>- Lifestyle Choices<br/>- Smoking/Drinking<br/>- Pets, Noise, Temp]
    
    FillForm --> SubmitProfile[Submit Profile]
    SubmitProfile --> SaveProfile[POST /api/personalities]
    SaveProfile --> ProfileCreated[Profile Created in DB]
    
    ProfileCreated --> FindMatches
    CheckProfile -->|Yes| FindMatches[Click Find Matches]
    
    FindMatches --> FetchMatches[GET /api/matching/find-match/:userId]
    
    FetchMatches --> LoadAllProfiles[Load All Personality Profiles]
    LoadAllProfiles --> CalculateScores[Calculate Compatibility Scores]
    
    CalculateScores --> SleepScore[Sleep Schedule: 20 pts]
    CalculateScores --> StudyScore[Study Habits: 15 pts]
    CalculateScores --> CleanScore[Cleanliness: 15 pts]
    CalculateScores --> SocialScore[Social Pref: 15 pts]
    CalculateScores --> LifestyleScore[Lifestyle: 20 pts]
    CalculateScores --> NoiseScore[Noise: 10 pts]
    CalculateScores --> TempScore[Temperature: 5 pts]
    
    SleepScore --> TotalScore[Total Compatibility: 0-100%]
    StudyScore --> TotalScore
    CleanScore --> TotalScore
    SocialScore --> TotalScore
    LifestyleScore --> TotalScore
    NoiseScore --> TotalScore
    TempScore --> TotalScore
    
    TotalScore --> SortMatches[Sort by Score DESC]
    SortMatches --> DisplayMatches[Display Match Cards:<br/>- Avatar<br/>- Name<br/>- Compatibility %<br/>- Key Traits]
    
    DisplayMatches --> UserAction{User Action}
    
    UserAction -->|View Details| ExpandCard[Show Full Profile]
    ExpandCard --> UserAction
    
    UserAction -->|AI Analysis| RequestAI[Click AI Analysis]
    RequestAI --> CallGroq[GET /api/matching/ai-analysis/:id1/:id2]
    CallGroq --> GroqAPI[GROQ API Call<br/>Llama 3.3 70B]
    GroqAPI --> AIResponse[AI Generated:<br/>- Compatibility Report<br/>- Strengths<br/>- Potential Issues<br/>- Conversation Starters]
    AIResponse --> ShowAIModal[Display AI Analysis]
    ShowAIModal --> UserAction
    
    UserAction -->|Send Knock| ClickKnock[Click Knock Button]
    ClickKnock --> ConfirmKnock{Confirm<br/>Connection?}
    
    ConfirmKnock -->|No| UserAction
    ConfirmKnock -->|Yes| SendKnock[POST /api/knocks]
    
    SendKnock --> CreateKnock[Create Knock Record:<br/>- senderId<br/>- recipientId<br/>- status: pending]
    CreateKnock --> NotifyRecipient[Create Notification<br/>for Recipient]
    NotifyRecipient --> ShowKnockSent[Show Success:<br/>Knock Sent!]
    ShowKnockSent --> End([Waiting for Response])
```

### 5. Knock-Knock System Flow

```mermaid
flowchart TD
    Start([Knock Received]) --> Notification[User sees Notification<br/>in Navbar]
    
    Notification --> ClickNotif[Click Notification]
    ClickNotif --> KnockKnockPage[Navigate to Knock-Knock Page]
    
    KnockKnockPage --> LoadKnocks[GET /api/knocks?userId=X]
    LoadKnocks --> DisplayTabs[Display Tabs:<br/>- Received<br/>- Sent<br/>- Accepted]
    
    DisplayTabs --> ReceivedTab[View Received Tab]
    ReceivedTab --> ShowPending[Show Pending Knocks:<br/>- Sender Profile<br/>- Compatibility %]
    
    ShowPending --> UserDecision{User Decision}
    
    UserDecision -->|Reject| ClickReject[Click Reject]
    ClickReject --> UpdateReject[Update Status: rejected]
    UpdateReject --> RemoveFromList[Remove from Pending]
    RemoveFromList --> End1([Knock Rejected])
    
    UserDecision -->|Accept| ClickAccept[Click Accept]
    ClickAccept --> AcceptKnock[PUT /api/knocks/:id/accept]
    
    AcceptKnock --> UpdateStatus[Update Status: accepted]
    UpdateStatus --> NotifySender[Create Notification:<br/>Your knock was accepted!]
    NotifySender --> MoveToAccepted[Move to Accepted Tab]
    
    MoveToAccepted --> ShowConnectionPage[Show Connection Page Button]
    ShowConnectionPage --> UserClicksConnection{Navigate to<br/>Connection?}
    
    UserClicksConnection -->|Yes| ConnectionPage[Connection Page]
    ConnectionPage --> LoadConnection[GET /api/connections/:userId]
    
    LoadConnection --> ShowProfiles[Display Both Profiles:<br/>Side-by-side Comparison]
    ShowProfiles --> FetchSuggestions[GET /api/dorms/shared-suggestions]
    
    FetchSuggestions --> CalculatePriceRange[Calculate Price Intersection:<br/>User A: min-max<br/>User B: min-max<br/>Result: overlap or average]
    
    CalculatePriceRange --> QueryDoubleRooms[Query Rooms:<br/>- Type: Double<br/>- Price <= maxPrice * 2]
    
    QueryDoubleRooms --> HasRooms{Rooms<br/>Found?}
    
    HasRooms -->|No| FallbackQuery[Fetch Cheapest<br/>20 Double Rooms]
    FallbackQuery --> GroupByDorm
    
    HasRooms -->|Yes| GroupByDorm[Group by Dorm<br/>Find Best Deal per Dorm]
    GroupByDorm --> CalculateSplit[Calculate:<br/>- Total Room Price<br/>- Per-person: price/2]
    
    CalculateSplit --> DisplayDormCards[Display Dorm Cards:<br/>- Image<br/>- Location<br/>- Double Room: ฿X<br/>- You Pay: ฿X/person]
    
    DisplayDormCards --> EnableChat[Enable Chat Widget]
    EnableChat --> ChatReady[Floating Chat Button]
    
    ChatReady --> UserAction{User Action}
    
    UserAction -->|Open Chat| OpenChatWidget[Click Chat Button]
    OpenChatWidget --> LoadConversation[GET /api/conversations]
    
    LoadConversation --> HasConvo{Conversation<br/>Exists?}
    
    HasConvo -->|No| CreateConvo[POST /api/conversations<br/>participants: [user1, user2]]
    HasConvo -->|Yes| LoadMessages[GET /api/messages?conversationId=X]
    CreateConvo --> LoadMessages
    
    LoadMessages --> DisplayChat[Show Chat Widget:<br/>- Messages History<br/>- Message Input]
    
    DisplayChat --> TypeMessage[User Types Message]
    TypeMessage --> SendMessage[Press Enter or Click Send]
    SendMessage --> PostMessage[POST /api/messages]
    
    PostMessage --> SaveMessage[Save to DB:<br/>- conversationId<br/>- senderId<br/>- text<br/>- timestamp]
    SaveMessage --> NotifyRecipient2[Create Chat Notification]
    NotifyRecipient2 --> UpdateUI[Update Chat UI<br/>Show Sent Message]
    
    UpdateUI --> AutoRefresh[Auto-refresh every 30s<br/>to fetch new messages]
    AutoRefresh --> ChatActive([Chat Active])
    
    UserAction -->|View Dorm| ClickDormCard[Click Suggested Dorm]
    ClickDormCard --> NavigateToDorm[Navigate to Dorm Detail]
    NavigateToDorm --> End2([Continue Booking Flow])
    
    UserClicksConnection -->|No| End3([Stay on Knock Page])
```

---

## Dorm Admin Workflows

### 6. Dorm Creation Flow

```mermaid
flowchart TD
    Start([Admin Logged In]) --> Dashboard[Admin Dashboard]
    Dashboard --> MyDorms[Navigate to My Dorms]
    
    MyDorms --> LoadDorms[GET /api/dorms/my]
    LoadDorms --> DisplayDorms[Display Admin's Dorms]
    
    DisplayDorms --> ClickCreate[Click Create Dorm]
    ClickCreate --> DormForm[Dorm Creation Form]
    
    DormForm --> FillBasicInfo[Fill Basic Info:<br/>- Dorm Name<br/>- Description]
    
    FillBasicInfo --> FillAddress[Fill Address:<br/>- Address Line 1<br/>- Sub-district<br/>- District<br/>- Province<br/>- Zip Code<br/>- Country]
    
    FillAddress --> FillCoordinates[Fill Coordinates:<br/>- Latitude<br/>- Longitude]
    
    FillCoordinates --> FillPricing[Fill Pricing:<br/>- Base Room Price<br/>- Insurance Policy<br/>- Contract Duration]
    
    FillPricing --> FillUtilities[Fill Utility Fees:<br/>Water:<br/>- Amount<br/>- Billing Type per-month/per-unit<br/>Electricity:<br/>- Amount<br/>- Billing Type]
    
    FillUtilities --> FillContact[Fill Contact Info:<br/>- Email<br/>- Phone<br/>- LINE ID<br/>- Facebook]
    
    FillContact --> AddAmenities[Add Amenities:<br/>- WiFi<br/>- Parking<br/>- Laundry<br/>- etc.]
    
    AddAmenities --> UploadImages[Upload Images:<br/>Multiple image files]
    
    UploadImages --> ReviewForm{Review<br/>All Fields}
    
    ReviewForm -->|Incomplete| ShowValidation[Show Validation Errors]
    ShowValidation --> DormForm
    
    ReviewForm -->|Complete| SubmitForm[Submit Form]
    SubmitForm --> GetNextId[Get Next Dorm ID<br/>from Counter Service]
    
    GetNextId --> CreateDorm[POST /api/dorms<br/>with multipart/form-data]
    
    CreateDorm --> SaveImages[Save Images to /uploads]
    SaveImages --> CreateDormDB[Create Dorm in DB:<br/>- admin_id = current user<br/>- isActive = true]
    
    CreateDormDB --> ReturnDorm[Return Created Dorm]
    ReturnDorm --> ShowSuccess[Show Success Message]
    ShowSuccess --> RefreshList[Refresh Dorms List]
    RefreshList --> End([Dorm Created])
```

### 7. Room Management Flow

```mermaid
flowchart TD
    Start([Admin in Dashboard]) --> RoomsPage[Navigate to Rooms Page]
    
    RoomsPage --> LoadRooms[GET /api/rooms]
    LoadRooms --> FilterOwnDorms[Backend filters:<br/>Only rooms from<br/>admin's dorms]
    
    FilterOwnDorms --> DisplayRooms[Display Rooms Table:<br/>- Room Number<br/>- Dorm<br/>- Floor<br/>- Type<br/>- Price<br/>- Status]
    
    DisplayRooms --> AdminAction{Admin Action}
    
    AdminAction -->|Add Room| ClickAdd[Click Add Room]
    ClickAdd --> RoomForm[Room Creation Form]
    
    RoomForm --> SelectDorm[Select Dorm<br/>from owned dorms]
    SelectDorm --> FillRoomDetails[Fill Details:<br/>- Room Number<br/>- Floor<br/>- Type Single/Double/Suite<br/>- Capacity<br/>- Monthly Price<br/>- Booking Fee<br/>- Zone/Building<br/>- Bed Type<br/>- Size sqm]
    
    FillRoomDetails --> AddRoomAmenities[Add Amenities:<br/>- AC<br/>- Balcony<br/>- Private Bath<br/>- etc.]
    
    AddRoomAmenities --> SetAvailability[Set Status:<br/>- Available<br/>- Occupied<br/>- Maintenance]
    
    SetAvailability --> SubmitRoom[Submit Form]
    SubmitRoom --> ValidateRoom{Validate<br/>Input}
    
    ValidateRoom -->|Invalid| ShowRoomError[Show Errors]
    ShowRoomError --> RoomForm
    
    ValidateRoom -->|Valid| CreateRoom[POST /api/rooms]
    CreateRoom --> SaveRoomDB[Save Room to DB:<br/>- dormId<br/>- All room details<br/>- status: Available]
    
    SaveRoomDB --> RoomSuccess[Show Success]
    RoomSuccess --> RefreshRooms[Refresh Rooms List]
    RefreshRooms --> DisplayRooms
    
    AdminAction -->|Edit Room| ClickEdit[Click Edit Icon]
    ClickEdit --> LoadRoomData[Fetch Room Data]
    LoadRoomData --> PreFillEdit[Pre-fill Form with<br/>existing data]
    
    PreFillEdit --> ModifyFields[Admin Modifies Fields]
    ModifyFields --> SubmitUpdate[Submit Changes]
    SubmitUpdate --> UpdateRoom[PUT /api/rooms/:id]
    UpdateRoom --> UpdateDB[Update Room in DB]
    UpdateDB --> EditSuccess[Show Success]
    EditSuccess --> RefreshRooms
    
    AdminAction -->|Delete Room| ClickDelete[Click Delete]
    ClickDelete --> ConfirmDelete{Confirm<br/>Deletion?}
    
    ConfirmDelete -->|No| DisplayRooms
    ConfirmDelete -->|Yes| DeleteRoom[DELETE /api/rooms/:id]
    DeleteRoom --> RemoveFromDB[Remove from Database]
    RemoveFromDB --> DeleteSuccess[Show Success]
    DeleteSuccess --> RefreshRooms
    
    AdminAction -->|Reserve Room| ClickReserve[Click Reserve]
    ClickReserve --> ReserveForm[Enter:<br/>- User ID<br/>- Move-in Date]
    ReserveForm --> SubmitReserve[Submit]
    SubmitReserve --> CallReserveAPI[POST /api/rooms/:id/reserve]
    
    CallReserveAPI --> UpdateRoomStatus[Update:<br/>- status: Occupied<br/>- currentOccupantId<br/>- moveInDate]
    UpdateRoomStatus --> ReserveSuccess[Show Success]
    ReserveSuccess --> RefreshRooms
    
    AdminAction -->|View Details| ClickView[View Room]
    ClickView --> ShowDetails[Display Full Room Info]
    ShowDetails --> End([Room Management])
```

### 8. Booking Management Flow (with RBAC)

```mermaid
flowchart TD
    Start([Admin in Dashboard]) --> BookingsPage[Navigate to Bookings]
    
    BookingsPage --> LoadBookings[GET /api/bookings]
    LoadBookings --> CheckRole{User Role}
    
    CheckRole -->|System Admin| AllBookings[Fetch ALL Bookings]
    CheckRole -->|Dorm Admin| RBACFilter[RBAC Filtering]
    
    RBACFilter --> FindOwnDorms[Query Dorm Model:<br/>Find dorms where<br/>admin_id = currentUserId]
    FindOwnDorms --> ExtractDormIds[Extract dormIds array]
    ExtractDormIds --> FilterBookings[Query Bookings:<br/>dormId IN dormIds]
    
    FilterBookings --> OwnBookings[Return Only<br/>Own Dorm Bookings]
    OwnBookings --> DisplayTable
    AllBookings --> DisplayTable
    
    DisplayTable[Display Bookings Table:<br/>- Guest Name<br/>- Room Number<br/>- Move-in Date<br/>- Amount<br/>- Status Badge<br/>- Actions]
    
    DisplayTable --> AdminAction{Admin Action}
    
    AdminAction -->|Refresh| ClickRefresh[Click Refresh Button]
    ClickRefresh --> LoadBookings
    
    AdminAction -->|View Details| ClickDetails[Click Actions Icon]
    ClickDetails --> FetchBooking[GET /api/bookings/:id]
    
    FetchBooking --> VerifyAccess{Admin Owns<br/>This Booking's Dorm?}
    
    VerifyAccess -->|No| AccessDenied[Error 403:<br/>Access Denied]
    AccessDenied --> DisplayTable
    
    VerifyAccess -->|Yes| ShowModal[Display Booking Modal:<br/>- Booking ID<br/>- User Details<br/>- Room Details<br/>- Move-in Date<br/>- Booking Fee<br/>- Total Amount<br/>- Status<br/>- Created Date]
    
    ShowModal --> StatusDropdown[Status Dropdown:<br/>- Pending<br/>- Confirmed<br/>- Cancelled]
    
    StatusDropdown --> AdminChanges{Admin Changes<br/>Status?}
    
    AdminChanges -->|No| CloseModal[Click Close]
    CloseModal --> DisplayTable
    
    AdminChanges -->|Yes| SelectNewStatus[Select New Status]
    SelectNewStatus --> ClickSave[Click Save]
    
    ClickSave --> UpdateBooking[PUT /api/bookings/:id]
    UpdateBooking --> VerifyOwnershipAgain{Verify Dorm<br/>Ownership}
    
    VerifyOwnershipAgain -->|No| UpdateDenied[Error 403:<br/>Cannot modify]
    UpdateDenied --> ShowModal
    
    VerifyOwnershipAgain -->|Yes| UpdateStatus[Update booking.status<br/>in Database]
    UpdateStatus --> SaveChanges[Save to DB]
    SaveChanges --> NotifyUser[Create Notification<br/>for Student]
    
    NotifyUser --> ShowUpdateSuccess[Show Success Message]
    ShowUpdateSuccess --> CloseModalAuto[Auto-close Modal]
    CloseModalAuto --> RefreshTable[Refresh Bookings]
    RefreshTable --> End([Booking Updated])
```

---

## System Integration Flows

### 9. Notification System Flow

```mermaid
flowchart TD
    Start([System Event Occurs]) --> EventType{Event Type}
    
    EventType -->|New Knock| KnockEvent[Knock Created]
    EventType -->|Knock Accepted| AcceptEvent[Knock Accepted]
    EventType -->|New Booking| BookingEvent[Booking Created]
    EventType -->|Chat Message| MessageEvent[Message Sent]
    EventType -->|System Alert| SystemEvent[System Notification]
    
    KnockEvent --> CreateKnockNotif[Create Notification:<br/>type: 'knock'<br/>title: 'New Knock!'<br/>message: 'X wants to connect'<br/>recipientId: knock.recipientId<br/>data: senderId, knockId]
    
    AcceptEvent --> CreateAcceptNotif[Create Notification:<br/>type: 'knock_accepted'<br/>title: 'Knock Accepted'<br/>message: 'X accepted your knock'<br/>recipientId: knock.senderId<br/>data: recipientId, knockId]
    
    BookingEvent --> GetDormAdmin[Get Dorm admin_id]
    GetDormAdmin --> CreateBookingNotif[Create Notification:<br/>type: 'booking'<br/>title: 'New Booking'<br/>message: 'X booked room Y'<br/>recipientId: admin_id<br/>data: bookingId, userId, roomId]
    
    MessageEvent --> CheckIfActive{Recipient has<br/>active chat session?}
    CheckIfActive -->|Yes| SkipNotif[Skip Notification<br/>User can see message]
    CheckIfActive -->|No| CreateOrUpdateNotif[Find or Create Message Notification]
    
    CreateOrUpdateNotif --> ExistingMsgNotif{Existing notif<br/>from sender?}
    ExistingMsgNotif -->|Yes| UpdateNotif[Update Notification:<br/>message = new message text<br/>timestamp = now]
    ExistingMsgNotif -->|No| CreateMsgNotif[Create New Notification:<br/>type: 'message'<br/>title: 'New Message'<br/>message: message text<br/>recipientId<br/>data: senderId, conversationId]
    
    UpdateNotif --> SaveNotif
    CreateMsgNotif --> SaveNotif
    
    SystemEvent --> CreateSystemNotif[Create Notification:<br/>type: 'system'<br/>custom title/message<br/>recipientId]
    
    CreateKnockNotif --> SaveNotif[POST /api/notifications Internal]
    CreateAcceptNotif --> SaveNotif
    CreateBookingNotif --> SaveNotif
    CreateSystemNotif --> SaveNotif
    
    SaveNotif --> InsertDB[Insert into notifications collection:<br/>- recipientId<br/>- type<br/>- title<br/>- message<br/>- read: false<br/>- data: {}<br/>- createdAt]
    
    InsertDB --> NotificationStored[Notification Stored]
    NotificationStored --> WaitForPoll[Wait for Client Poll]
    
    WaitForPoll --> ClientPolls[Client Polls:<br/>GET /api/notifications<br/>Every 30 seconds]
    
    ClientPolls --> FetchUnread[Query DB:<br/>recipientId = userId<br/>read = false<br/>Sort by createdAt DESC]
    
    FetchUnread --> CountUnread[Count unread]
    CountUnread --> ReturnNotifs[Return:<br/>- notifications array<br/>- unread count]
    
    ReturnNotifs --> ClientReceives[Client Receives Data]
    ClientReceives --> UpdateBadge[Update Navbar Badge:<br/>Show unread count]
    UpdateBadge --> DisplayPanel[Update Notification Panel:<br/>List with icons/titles]
    
    DisplayPanel --> UserAction{User Action}
    
    UserAction -->|Click Notification| MarkAsRead[PUT /api/notifications/:id/read]
    MarkAsRead --> UpdateReadFlag[Update read: true in DB]
    UpdateReadFlag --> Navigate[Navigate to Related Page:<br/>- Knock page<br/>- Booking page<br/>- Chat page]
    Navigate --> DecrementBadge[Update Badge Count]
    
    UserAction -->|Delete| DeleteNotif[DELETE /api/notifications/:id]
    DeleteNotif --> RemoveFromDB[Remove from DB]
    RemoveFromDB --> RefreshPanel[Refresh Panel]
    
    UserAction -->|Ignore| ContinuePolling[Continue 30s Polling]
    ContinuePolling --> ClientPolls
    
    Navigate --> End([User Navigated])
    RefreshPanel --> End
    DecrementBadge --> End
    SkipNotif --> End
```

### 10. AI Roommate Analysis Flow

```mermaid
flowchart TD
    Start([User Requests AI Analysis]) --> ClickAI[Click AI Analysis Button<br/>on Match Card]
    
    ClickAI --> ShowLoading[Show Loading State]
    ShowLoading --> SendRequest[GET /api/matching/ai-analysis/:userId1/:userId2]
    
    SendRequest --> FetchProfiles[Fetch Both Personality Profiles<br/>from Database]
    FetchProfiles --> CheckCache{Check<br/>AiMatchResult cache}
    
    CheckCache -->|Found Recent| ReturnCached[Return Cached Analysis<br/>if less than 24h old]
    ReturnCached --> DisplayResult
    
    CheckCache -->|Not Found/Expired| BuildPrompt[Build AI Prompt]
    BuildPrompt --> FormatProfiles[Format User Profiles:<br/>User 1: name, MBTI, traits<br/>User 2: name, MBTI, traits]
    
    FormatProfiles --> CreatePrompt[Create Detailed Prompt:<br/>'Analyze compatibility between:<br/>User 1: [profile data]<br/>User 2: [profile data]<br/><br/>Provide:<br/>1. Overall compatibility<br/>2. Strengths<br/>3. Potential conflicts<br/>4. Advice<br/>5. Conversation starters']
    
    CreatePrompt --> CallGroqAPI[Call GROQ API:<br/>Model: llama-3.3-70b-versatile<br/>Temperature: 0.7<br/>Max Tokens: 1024]
    
    CallGroqAPI --> GroqProcessing[GROQ AI Processing:<br/>- Analyze personalities<br/>- Compare traits<br/>- Generate insights<br/>- Create recommendations]
    
    GroqProcessing --> ReceiveResponse[Receive AI Response]
    ReceiveResponse --> ParseResponse[Parse JSON/Text Response]
    
    ParseResponse --> ExtractData[Extract:<br/>- Compatibility Score<br/>- Strengths List<br/>- Concerns List<br/>- Advice Text<br/>- Conversation Starters]
    
    ExtractData --> SaveCache[Save to AiMatchResult:<br/>- userId1<br/>- userId2<br/>- analysis result<br/>- timestamp<br/>- expiresAt: +24h]
    
    SaveCache --> DisplayResult[Return AI Analysis]
    
    DisplayResult --> ShowModal[Display Modal:<br/>- Compatibility % with visual<br/>- Strengths section<br/>- Potential Issues section<br/>- Advice paragraph<br/>- Conversation Starters list]
    
    ShowModal --> UserReview[User Reviews Analysis]
    UserReview --> UserDecision{User Decision}
    
    UserDecision -->|Close| CloseModal[Close Modal]
    CloseModal --> End1([Analysis Complete])
    
    UserDecision -->|Send Knock| InitiateKnock[Navigate to Knock Action]
    InitiateKnock --> End2([Proceed to Knock Flow])
```

### 11. Price Calculation & Invoice Generation Flow

```mermaid
flowchart TD
    Start([User on Booking Page]) --> LoadData[Load Dorm \u0026 Room Data]
    
    LoadData --> ExtractPricing[Extract Pricing Data:<br/>- room.price_per_month<br/>- dorm.insurance_policy<br/>- room.booking_fees<br/>- dorm.Water_fee<br/>- dorm.Electricity_fee<br/>- dorm.waterBillingType<br/>- dorm.electricityBillingType]
    
    ExtractPricing --> CalcUtilities[Calculate Utility Estimates]
    
    CalcUtilities --> CheckWaterType{Water Billing<br/>Type?}
    CheckWaterType -->|per-unit| WaterEstimate200[Water Estimate: ฿200<br/>Fixed estimate for usage]
    CheckWaterType -->|per-month| WaterActual[Water Fee: dorm.Water_fee<br/>Exact monthly cost]
    
    WaterEstimate200 --> CheckElectricType
    WaterActual --> CheckElectricType
    
    CheckElectricType{Electricity<br/>Billing Type?}
    CheckElectricType -->|per-unit| ElectricEstimate500[Electricity Estimate: ฿500<br/>Fixed estimate for usage]
    CheckElectricType -->|per-month| ElectricActual[Electricity Fee: dorm.Electricity_fee<br/>Exact monthly cost]
    
    ElectricEstimate500 --> BuildPriceObject
    ElectricActual --> BuildPriceObject
    
    BuildPriceObject[Build prices object:<br/>- roomPerMonth<br/>- insurance<br/>- bookingFee<br/>- waterRate<br/>- electricityRate<br/>- waterFees estimated<br/>- electricityFees estimated<br/>- waterLabel with type<br/>- electricityLabel with type]
    
    BuildPriceObject --> CalcFirstMonth[Calculate First Month Total:<br/>= roomPerMonth<br/>- bookingFee already paid<br/>+ insurance one-time<br/>+ waterFees<br/>+ electricityFees]
    
    CalcFirstMonth --> CalcFollowing[Calculate Following Months:<br/>= roomPerMonth<br/>+ waterFees<br/>+ electricityFees]
    
    CalcFollowing --> DisplayBreakdown[Display Price Breakdown:<br/><br/>Room Price: ฿X/month<br/>Insurance: ฿Y one-time<br/>Booking Fee: ฿Z<br/>Water Fees ฿A / unit: ~฿200<br/>Electricity ฿B / unit: ~฿500<br/><br/>First Month Total: ~฿X,XXX<br/>Following Months: ~฿X,XXX]
    
    DisplayBreakdown --> UserConfirms{User Confirms<br/>Booking?}
    
    UserConfirms -->|No| EditBooking[User edits details]
    EditBooking --> CalcUtilities
    
    UserConfirms -->|Yes| SubmitBooking[Submit Booking Form]
    SubmitBooking --> CreateBookingRecord[Create Booking in DB]
    
    CreateBookingRecord --> PrepareInvoiceData[Prepare Invoice Data:<br/>- bookingId<br/>- invoiceDate: now<br/>- customerName<br/>- customerEmail<br/>- customerPhone<br/>- dormName<br/>- dormAddress<br/>- dormPhone/Email/LINE/FB<br/>- roomNumber<br/>- roomType<br/>- floor<br/>- moveInDate<br/>- stayDuration<br/>- All pricing details]
    
    PrepareInvoiceData --> GenerateHTML[Generate Invoice HTML:<br/>- Professional template<br/>- Company header<br/>- Invoice # and Date<br/>- Customer info section<br/>- Property details<br/>- Itemized price table<br/>- Subtotals<br/>- Grand total<br/>- Footer with terms]
    
    GenerateHTML --> ShowSuccessDialog[Show Success Dialog:<br/>- Booking confirmed<br/>- Booking ID<br/>- Amount paid]
    
    ShowSuccessDialog --> OfferDownload{User Clicks<br/>Download Invoice?}
    
    OfferDownload -->|No| CloseAndRedirect[Redirect to Account Page]
    
    OfferDownload -->|Yes| OpenPreviewModal[Open Invoice Preview Modal:<br/>- Full-screen overlay<br/>- Iframe with HTML invoice<br/>- A4 size 210mm x 297mm]
    
    OpenPreviewModal --> UserAction{User Action}
    
    UserAction -->|Download PDF| TriggerDownload[Trigger Browser Print:<br/>window.print<br/>or PDF generation library]
    TriggerDownload --> SavePDF[User saves as PDF<br/>filename: invoice-bookingId.pdf]
    SavePDF --> DownloadComplete[PDF Downloaded]
    
    UserAction -->|Close Preview| ClosePreview[Close Modal]
    DownloadComplete --> ClosePreview
    
    ClosePreview --> RedirectAccount[Redirect to My Account]
    CloseAndRedirect --> RedirectAccount
    
    RedirectAccount --> End([Booking \u0026 Invoice Complete])
```

---

## Summary

This workflow documentation covers:

✅ **11 Detailed Workflow Diagrams** covering all major system processes
✅ **Mermaid Diagram Format** for clear visualization
✅ **Decision Points** showing all conditional logic paths
✅ **API Endpoints** referenced at each integration point
✅ **Database Operations** showing data persistence steps
✅ **Error Handling** paths for validation and failures
✅ **Security Checks** including RBAC verification steps
✅ **User Journey Maps** from start to completion

Each workflow can be rendered as a visual diagram using any Mermaid-compatible viewer or documentation tool.
