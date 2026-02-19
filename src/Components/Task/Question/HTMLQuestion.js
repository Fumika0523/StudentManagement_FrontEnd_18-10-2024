// src/data/htmlTasks.js

const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

const htmlQuestionTasks = [
  "1. What are HTML tags?",
  "2. What’s the difference between HTML and HTML5?",
  "3. What’s the basic structure of an HTML document?",
  "4. What’s the difference between a tag and an element?",
  "5. What are attributes in HTML? Give common examples.",
  "6. What is the difference between <section>, <article>, and <div>?",
  "7. How do you create hyperlinks? What are absolute vs relative URLs?",
  "8. What’s the <img> tag for?",
  "9. What’s the difference between block-level and inline elements?",
  "10. What kinds of lists can you make in HTML?",
  "11. What is the <form> tag and what do action and method do?",
  "12. What does the <br> tag do and when should you avoid it?",
  "13. How do you make a link open in a new tab safely?",
  "14. What does the <title> tag do and why is it important for SEO?",
  "15.  What’s the <meta>tag?",
  "16. How do you make a table?",
  "17. How do you make an email link?",
  "18. What’s the <em> tag?",
  "19.  How do you make a checkbox?",
  "20. What is the <label> tag and how does for/id improve accessibility?",
  "21.How do you make a dropdown list?",
  "22. What is the <blockquote> tag and when should you use cite?",
  "23. How HTML is different from CSS?",
  "24. What are semantic HTML elements?",
  "25. How do you add a video in HTML5?",
  "26. Why is the alt attribute important in <img>?",
  "27.  What’s the <fieldset>tag?",
  "28. What does <noscript> do and why is it still relevant?",
  "29. How do you add a JavaScript file?",
  "30. How do you add CSS styling in an HTML file?",
];

export const HTML_TASKS_STATIC = htmlQuestionTasks.map((q, idx) => ({
  // Matches your Task model fields used in table
  _id: `static-task-${idx + 1}`,     // for React key
  taskId: idx + 1,                  // index number
  batchNumber: "B001",              // required by your model
  courseName: "HTML",
  taskDetails: q,
  status: "unassigned",

  // for table display (strings are easiest)
  createdAt: today,
  updatedAt: today,
}));
