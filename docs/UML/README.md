# UML Diagrams & Modeling Artifacts

This directory contains the UML design models and structural/behavioral diagrams for **ProjectFlow**.

---

## 1. Use Case Diagram

```mermaid
graph LR
    subgraph Actors
        Student((Student))
        Faculty((Faculty))
        Admin((Administrator))
    end

    subgraph ProjectFlow System
        UC1([Register / Login])
        UC2([Create Project & Team])
        UC3([Manage Requirements])
        UC4([Manage Tasks & Kanban])
        UC5([Connect GitHub Repo])
        UC6([Submit Milestones])
        UC7([View Project Dashboard])
        
        UC8([Review Milestones & Docs])
        UC9([Monitor Individual Contributions])
        UC10([Provide Qualitative Feedback])
        UC11([Evaluate & Grade Rubrics])
        
        UC12([Manage Users & Roles])
        UC13([Assign Faculty Mentors])
        UC14([Configure Evaluation Rubrics])
        UC15([Export Final Grade Reports])
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    Faculty --> UC1
    Faculty --> UC8
    Faculty --> UC9
    Faculty --> UC10
    Faculty --> UC11

    Admin --> UC1
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
```

---

## 2. Sequence Diagram: Task Creation & Notification

```mermaid
sequenceDiagram
    autonumber
    actor S as Student (Client)
    participant GW as API Gateway (:5000)
    participant TS as Task Service (:5003)
    participant TDB as task_db (Mongo)
    participant MQ as RabbitMQ Broker
    participant NS as Notification Service (:5006)
    participant NDB as notification_db (Mongo)

    S->>GW: POST /api/tasks (Bearer JWT)
    GW->>TS: Forward Request with User Context
    TS->>TDB: Insert new Task document
    TDB-->>TS: Document created (_id)
    TS->>MQ: Publish event 'TASK_CREATED' {taskId, assignedTo, projectId}
    TS-->>GW: HTTP 201 Created {task}
    GW-->>S: HTTP 201 Created {task}

    MQ->>NS: Consume 'TASK_CREATED'
    NS->>NDB: Store in-app notification for assigned user
    NS-->>S: Real-time notification dispatched
```

---

## 3. Sequence Diagram: Milestone Evaluation Flow

```mermaid
sequenceDiagram
    autonumber
    actor F as Faculty (Client)
    participant GW as API Gateway (:5000)
    participant ES as Evaluation Service (:5004)
    participant EDB as evaluation_db (Mongo)
    participant MQ as RabbitMQ Broker
    participant NS as Notification Service (:5006)

    F->>GW: POST /api/evaluations {projectId, milestoneId, rubricMarks, feedback}
    GW->>ES: Forward Evaluation Payload
    ES->>EDB: Save Evaluation Record
    EDB-->>ES: Saved Successfully
    ES->>MQ: Publish event 'EVALUATION_COMPLETED' {projectId, marks, feedback}
    ES-->>GW: HTTP 201 Created {evaluation}
    GW-->>F: HTTP 201 Created {evaluation}

    MQ->>NS: Consume 'EVALUATION_COMPLETED'
    NS->>NS: Notify all student team members
```

---

## 4. Academic Reference Files
For full lab documentation and draw.io source files, refer to:
- `../SE_Projectflow.drawio`
- `../Sequence Diagram.pdf`
- `../UML.pdf`
