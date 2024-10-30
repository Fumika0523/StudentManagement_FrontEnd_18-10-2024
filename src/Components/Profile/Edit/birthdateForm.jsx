function birthdateForm({userData}){
    const formatDate = (dateString) => {
        const date = new Date(dateString); 
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // showing only year, month, day in number
        return date.toLocaleDateString('en-US', options); // show in US date style
        };

    return(
        <>
        <div className="m-5 p-3 border border-secondary-subtle rounded" style={{width:"80%"}}>
        {/* Birthday */}
        <div className='border-bottom border-secondary-subtle d-flex text-secondary py-3' style={{fontSize:"80%"}}>
        <div style={{width:"30%"}}>Birthday</div>
        {/*  calling formatDate() function */}
        <div>{formatDate(birthdate)}</div> 
        </div>
        </div>
        </>
    )
}
export default birthdateForm
