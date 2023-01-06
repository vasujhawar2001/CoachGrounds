//wrapping try and catch block for async function callbacks

module.exports = func =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}

//cool way to defining fuctions as utilities, to be used most of the times
