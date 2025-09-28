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

//phone number edit form
//update password form >> when you updating need encrypting
//navBar >> search bar + 2 icons
//logout >> navigate to signup page <<<DONE>>>
///dashboard create only 1 card
// import 4 icons and 4 colours

import { TfiBag } from "react-icons/tfi";
<TfiBag />

<!-- Bg color -->
background-color: #4e73df;

<!-- WHen  -->

//create a drop down icon

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
2. SideBar mobile responsible
3. Bar chart
4. Student user access (student table should be visible?)
5. Profile edit (only Staff can do it ?)
6. Fix all Table design
7. Utilities ?
8. Page ??
9. Charts?
10. Tables?
11. Email icon function?
12. Notification icon function?
13. Search function for search box
14. When admin login , admin icon should show on profile
15. when student login, student icon should show on profile
16. Profile function ?
17. change the backend to cloud url

- Download the collection, upload to github                                                     ----> DONE
- MongoDB Atlas URL                                                                             --->>> DONE
- check importance of const [isAuthenticated,setIsAuthenticated]=useState(false) vs token
--> token = permanent credential, used for API requests.
--> isAuthenticated = temporary UI state, allows immediate reactivity in React.

Both are needed together for a smooth login experience without page refresh.

CRUD---
Student: when you add, admission date and course id is not showing
Admission: everything is working 
Course: everything is working 
Batch: Working fine, maybe form need to be updated

instead of eye icon >>>  key  --->>>>DONE
select Course name and student name and automatically each ids shows  ----->> DONE


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

5. Work on Search for Debounced 
<<<<PENDING>>>>

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

10. All the details should be shown in Student Section. (time, duration,course data, admissiondata,assigned/de-assigned <DropDown, by default: Assigned, only if you are already assigned to batch, or initially empty >), when you assigned de-assigned from a batch, all the changes should be applied.once you de-assigned, then it should reflect as de-assigned too. only during 7 days from start date. after 7days, only Super-admin can edit.
When you update(Edit), the Status should show on Modal(both Admission & student). not when you add the student initially in Add Admission.
Once you deassigned the Batch, both Admission and Student table should show De-assigned.
When its Deassigned, Batch count should reduce, and
Admission Table (StudentName, studentId) will show De-assigned.
Dashboard data should change.


11. Filter auto-search should not happen only "Submit" button is applied.
Options for Assign/Deassigned


12. Create profile for Staff >> Only Addition, Cancellation
Edit is only for Admin
Super Admin can have all access (including Deletion)
If you want cancel the admission, Admission is cancelled (Staff, Admin, Super Admin)

<!-- no of days * per day session= total duration
15  * 2      =30      

total duration >>145 hrs course >> 2hrs/day  >> 145/2 =74days                                                  >>HTML   
>> in the form >> total duration >> 2 >>30/2 >> 15 days
End date >>27-Sep-2025
13-Sept-2025   >>Cousre >>fees >> no of days  >> 13-Sept-2025 +15 >>27-Sep-2025 (Logic here)
 -->

<!-- Admin User -->
<!-- Super Admin User -->

