# Orphaned Pages Hierarchical Diagram

```mermaid
graph TD
    subgraph "Clinical Workflows"
        CW1["Administrative Functions"]
        CW2["Emergency Care"]
        CW3["Utility Functions"]
        CW4["Patient Management"]
        CW5["Authentication"]
        CW6["Clinical Documentation"]
        CW7["Medication Management"]
    end
    
    subgraph "User Roles"
        UR1["Doctor"]
        UR2["Nurse"]
        UR3["Admin"]
        UR4["System Administrator"]
        UR5["Pharmacist"]
    end
    
    CW1 --- P1["FunctionBlocks"]
    CW2 --- P2["EmergencyCare"]
    CW3 --- P3["Help"]
    CW3 --- P4["Messages"]
    CW3 --- P5["NewOrder"]
    CW3 --- P6["Notifications"]
    CW3 --- P7["PageNotFound"]
    CW3 --- P8["SectorSelection"]
    CW3 --- P9["NotFound"]
    CW4 --- P10["HospitalWorkflows"]
    CW4 --- P11["MedicalHistory"]
    CW5 --- P12["Index"]
    CW5 --- P13["Register"]
    CW5 --- P14["ResetPassword"]
    CW6 --- P15["RecordView"]
    CW6 --- P16["Records"]
    CW7 --- P17["RxNormManagement"]
    P1 --- UR3
    P1 --- UR4
    P2 --- UR1
    P2 --- UR2
    P3 --- UR1
    P3 --- UR2
    P3 --- UR3
    P3 --- UR4
    P3 --- UR5
    P4 --- UR1
    P4 --- UR2
    P4 --- UR3
    P4 --- UR4
    P4 --- UR5
    P5 --- UR1
    P5 --- UR2
    P5 --- UR3
    P5 --- UR4
    P5 --- UR5
    P6 --- UR1
    P6 --- UR2
    P6 --- UR3
    P6 --- UR4
    P6 --- UR5
    P7 --- UR1
    P7 --- UR2
    P7 --- UR3
    P7 --- UR4
    P7 --- UR5
    P8 --- UR1
    P8 --- UR2
    P8 --- UR3
    P8 --- UR4
    P8 --- UR5
    P9 --- UR1
    P9 --- UR2
    P9 --- UR3
    P9 --- UR4
    P9 --- UR5
    P10 --- UR1
    P10 --- UR2
    P10 --- UR3
    P11 --- UR1
    P11 --- UR2
    P11 --- UR3
    P12 --- UR1
    P12 --- UR2
    P12 --- UR3
    P12 --- UR4
    P12 --- UR5
    P13 --- UR1
    P13 --- UR2
    P13 --- UR3
    P13 --- UR4
    P13 --- UR5
    P14 --- UR1
    P14 --- UR2
    P14 --- UR3
    P14 --- UR4
    P14 --- UR5
    P15 --- UR1
    P15 --- UR2
    P16 --- UR1
    P16 --- UR2
    P17 --- UR1
    P17 --- UR2
    P17 --- UR5

```
