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

instead of eye icon >>>  key
select Course name and student name and automatically each ids shows


Batch No. Auto generate.
CourseName: Drop down 
Location: Type
Target Student: Type
Session Time: 
Fee: auto generate from Dropdown


Bulk-selection  >> Check box



QUESTION:
Admission Fee is same with course Fee?
Preferred course(student) vs Course name (admin).
>>> When admin data is added, preferred course in Student table should be keep as original preferred course? or should updated to coursename (added in Admin)




