# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


// when you create a form, no need to use onClick()

<form onSubmit={formik.handleSubmit}> <<Su>>
<Button
type="submit">
Save
</Button>
</form>



<!-- Breakpoint -->
Extra Small   >>    None   >>       <576px
Small         >>    sm     >>       >576px
Medium        >>    md      >>      >768px  
Large         >>    lg      >>      >992px
Extra Large         >> lg     >>    >1200px
Extra extra large   >> xxl      >>   >1400px

useRef is a React Hook that lets you reference a value that's not needed for rendering. const ref = useRef(initialValue)
https://react.dev/reference/react/useRef
-------------------------------------

Two login for student & Staff

student can  >>  register student,login, update the profile, later on - will be able to register student preference courses (Check boxes)

Staff can >>  register staff, login (staff), add data for the student (admission,batches,add the task,attendance)

Staff can add the number of courses, availability for the batches, create the task,

--------------------
1. When you signed in, Refreshing a page will auto-logout and re-direct to Signin page.    --->>> DONE : token was passed inside getUserData(). 

--> check importance of const [isAuthenticated,setIsAuthenticated]=useState(false) vs token
--> token = permanent credential, used for API requests.
--> isAuthenticated = temporary UI state, allows immediate reactivity in React.

Both are needed together for a smooth login experience without page refresh.

CRUD---
Student: when you add, admission date and course id is not showing
Admission: everything is working 
Course: everything is working 
Batch: Working fine, maybe form need to be updated

Batch No. Auto generate.
CourseName: Drop down 
Location: Type
Target Student: Type
Session Time: 
Fee: auto generate from Dropdown

Bulk-selection  >> Check box

multi-course can be saved too

QUESTION:
Admission Fee is same with course Fee? -->> SAME

Preferred course(student) vs Course name (admin).
>>> When admin data is added, preferred course in Student table should be keep as original preferred course? or should updated to coursename (added in Admin)

<!-- Select Course Model -->

When you sign in student, the preferred courses shoud show up (submit & skip) in Modal
5 Courses selections in Check Box/ Radio Button. anyone select at least one, then Skip should be grayed out / Removed, Only submit button will show


Skip: Update is cancelled
Submit: 

It should be visible to only 1st time login (), 2nd time login the modal should not be visible (skip/saved should be captured so it should no longer shown).

Map Method >> Add to Cart from MovieStation, how will you store in to a data.
if you have token, get particular student data.
student.preferredCourses = value that you enter >>>> update (put)
If student selected, then preferredcourse should show "skip" in table.
if its Array, how will you update to Table ? check front-end


QUESTIONS: student sign up should be studentData or userData?
-- Role Based profile
1.Update User Model --> 
    role:{
        type:String,
        enum:["admin","user","manager","supportTeam","testingTeam"],
        required:true,
        default:"user"
    }
    
    >>>> enum(Pre defined of array) 

2. Update  userSchema, Generate the token >> pass role:user.role too.

userSchema.methods.generateAuthToken = async function(req,res){
    const user = this
    const token = jwt.sign({_id:user.id,role:user.role},process.env.JWT_SECRET_KEY)
    console.log(token)
    return token
}
<!-- 
1. Same student cannot be assigned to the same batch, the student should be invisible from drop-down. <<<<DONE>>>>                         -->
 
<!-- 2.More than the target no., the student cannot be assigned >>>> Toast error shows 
<<<<DONE>>>> -->

<!-- 3. After 7 days of Batch start date, the batch should not be visible in Add Admission.
The lock icon should show in this batch and when you click icon, the message "please contact Admin"
<<<<DONE>>>>  -->

<!-- 4. Student can assign only 1 batch By Admin, super Admin can assign multiple batches to student
<<<<DONE>>>> -->


6. Batch start Date should be added manually and end date is auto calculated (30 days <<< This duration is coming from Course Data (Number of days) ), course Section  ,
 add "Daily Session Hours", auto calculation >> Number of Days
<<<<DONE>>>>

7.  put filter in View STudent, "Date By"."Batch", "Course Name", "By Gender" 
Date start By
<<<<PENDING>>>>

8. if the student is assigned to the batch, then from student section should not be deleted. 
<<<<DONE>>>>

9. if the batch is not assigned, the mapped course should not be shown in student section
<<<<DONE>>>>

10. All the details should be shown in Student Section. (time, duration,course data, admissiondata,assigned/de-assigned

11. Filter auto-search should not happen only "Submit" button is applied.
Options for Assign/Deassigned

12. Create profile for Staff <<<Done>>>
  A)  Only Addition, Cancellation,
  B)  Edit is only for Admin
Super Admin can have all access (including Deletion)
If you want cancel the admission, Admission is cancelled (Staff, Admin, Super Admin)

13. by default: Assigned, only if you are already assigned to batch, or initially empty >, when you assigned de-assigned from a batch, all the changes should be applied.once you de-assigned, then it should reflect as de-assigned too. only during 7 days from start date. after 7days, only Super-admin can edit.
When you update(Edit), the Status should show on Modal(both Admission & student). not when you add the student initially in Add Admission.
Once you deassigned the Batch, both Admission and Student table should show De-assigned.
When its Deassigned, Batch count should reduce, and
Admission Table (StudentName, studentId) will show De-assigned.
Dashboard data should change.

When you add the student in Admission, status will show assign by default.
When you Edit the student in Admission, you will have dropdown.
Question: De-assign >> if the batch is freezed, you are unable to de-assign ?

// When you select specific Month, the Line chart should show only specific month too - not full year
// Initial loading - full year (current year)

3.1 accordion - BatchData Top one ->>>> Design: Table <<<Above Admission Overview>>> , Yearly and Location wise

Table Header : 1. Student Enrollment(),2 Dropout,3 Total Assigned(), 4Certificate generated, number of batch counts, deassigned, 

When you click year, the full total of this year' data will show.
WHen you click the table data, the Modal will show and the details of the full year' Jan-December will show of that table header(student enrollment)

Year and Month dropdown should stay when you scoll

//1.Batch Completion Status -- When all training are completed, go to Batch completed
// 2.Training Completion --- currentData >= end Date 
// 3. In-training Batches - Full Year -
// currentData <= end Date 

3.3 Accordion - Admission Fee - How many student has completed pay / under due

// Certificate
// Drop out --> on a basis of attendance percentage less than 50 %
// Batch - in-training > training completed

// When your batch is completed - updated the form send a request to batch complete button >> Unlock the edit >> 

// 1. 4 check boxes (assign, deassign, drop-out,  certificate generated or not? )  <<<Done>>>
//2. when you select all, the status option will be enabled  <<<Done>>>
//3. Batch completed option will be able to select (only 1 dropdown)  and when you click this option  <<<Done>>>
//4. Save button should show.  <<<Done>>>
// Whhen you click save button then status is stored in a DB.<<<Done>>>

// Utilities - Attendance (Current 7 Days), Certificate

// in-training , Training completed, Not yet started, batch Completed.
//Add live icon when the batch status is in-training.  <<<Done>>>

/// lock icon change to Edit icon when the batch is completed <<<Done>>>

--------------------------------------------------------------------------------
1. Edit icon will show within 7 days since Batch is created. <<<Done>>>
2. When 7 days are passed, the Lock icon will show <<<Done>>>
3. When the batch is completed the status shows "Training completed" from "In-Progress". <<<Done>>>
4. When training completed shown, the button will show next to Lock Icon / or at the end. <<<Done>>>
5. When this button is clicked, the approval request will be sent to Admin (optional) <<<Done>>>
6. Once Admin is approved, the lock icon will changed to live-icon (To remind for the updations) and Edit icon will show.  <<<Done>>>
7. When you click Edit icon, 4 check boxes will show- assign, deassign, drop-out,  certificate generated or not?  <<<Done>>>
8. when you select all, the status option will be enabled  <<<Done>>>
9. Batch completed option will be able to select (only 1 dropdown) on STatus  and when you click this option <<<Done>>>
10. Save button should show. - send Put request <<<Done>>>
11. When you click save button then status is stored in a DB - and display on the browser. <<<Done>>>
12. From admin page, the review request icon should show in case the admin missed email request <<<Done>>> <<<Added by me>>>

Create a state variable for the batch status, use the state variable whenever i need to change the state you will update the state variable.

create 1 useEffect, here you do the put call - pass  the dependency array as a batch status and store in DB
Check how many times of UseEffect triggering

13. Add human icon in Action, and when you click this icon, the Modal (student Name, Asigned status, maximum 5) will shown and you can see all the student list and Add download button inside Modal, add simple search. when you type, the data should shown.<<<Done>>>

>>Add Google Button in frontend <<<Done>>>
>>add route there <<<Done>>>
>>where you going to display Google'name ?? <<<Done>>> Profile

15. how to register roles when you signed up with googleOAuth <<<Done>>>

------------------------------------

Staff Login
>> Side Bar >> Update attendance 
>> Form  
- 1. Batch Number > Drop down - Under training
- 2. Date > Calender will open
- 3. Mark Attendance >> Drop down : Absent / Present
- Click Submit 
>> Then you will get the all student name list Modal
Form check boxes next to the student info
Search option
save and update 
>> Search by Absent select check and save and update.
The rest all should be marked as present automatically 

studentModel : Attendance[{date,attendance}]
Show attendance: tabular format

>>Download option : 
----------------------------
Student Login
SideBar: View attendance  

Batch Number|
Date|Present|
Date|Absent |


Dashboard - Download report should be done in excel

in studentData Table, when training is completed the certificate icon should show and when you click the certificate should be downloaded

assignment
attendance
task


Question: When you deassign on editAdmisssion, the batchNumber and courseName, courseId needs to be cleared too ? If so, how to keep the record everything on DashBoard. how about admission fee ?
>>> everything should Keep the record and only status should change including fee. - just removing from a batch
>>> When you delete admission(super-admin), everything will be cancel.


Question - 27/01/2026
Student Enrolled counts is based on how many students are added in this month ? or how many students are assigned in that month.
>> 

Basic information for Modal.

When you click the number, the modal should open and the details should show (eg: student Enrolled --> student name list)
everywhere, has the hyperlink in table data - number.

Total Batches - modal: batch No. , start - end date.

Download button in assigned student - batchdata.


---------------------------------

Bulk Upload 

BulkDownload
