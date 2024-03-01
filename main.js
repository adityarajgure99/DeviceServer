express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { MongoClient } = require("mongodb")

// Defining the DB instance, database, and collection
const uri = "mongodb://127.0.0.1"
const client = new MongoClient(uri)
const dbname = "BLOGS"
const collectionName = "blogposts"

async function connectToDatabase() {
    // Establish a connection to the database
    try {
        await client.connect()
        console.log("Connected to MongoDB ...")
    } catch (error) {
        console.error(`error connecting to ${dbname} database`)
    } 
}


app.post('/posts', async (req,res) =>
{
    blogToInsert = 
    {
        title : req.body.title,
        content : req.body.content,
        username : req.body.username
    }
    
    try {
        const blogCollection = client.db(dbname).collection(collectionName)


        let docCount = blogCollection.countDocuments()

        console.log(JSON.stringify(blogToInsert))


        let result = await blogCollection.insertOne(blogToInsert)


        console.log(`Inserted document: ${result.insertedId}`)
        res.status(200).json(result)
    } catch(err) {
        console.error(`Error finding document: ${err}`)
    } finally {
        // console.log('Closing connection')
        // await client.close()
    }
})

app.get('/posts', async(req,res) =>
{
    try
    {
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = blogCollection.find()
        let docCount = blogCollection.countDocuments()
        await result.forEach( (doc) => 
        { 
           // console.log(doc)
            blogs.push(doc)
        })
        console.log(`Found ${await docCount} documents`)
        res.send(JSON.stringify(blogs))
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
    }

}
)

app.get('/posts/user/:username', async(req,res) =>
{
    try
    {
        console.log(req.params.username)
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = blogCollection.find({username: req.params.username})
        let docCount = blogCollection.countDocuments()
        await result.forEach( (doc) => 
        { 
           // console.log(doc)
            blogs.push(doc)
        })
        console.log(`Found ${await docCount} documents`)
        res.send(JSON.stringify(blogs))
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
    }

})

app.get('/posts/title/:searchWord', async(req,res) =>
{
    key=req.params.searchWord
    console.log(key)
    try
    {
        
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = blogCollection.find({title:{$regex: key , $options:'i'}})
        let docCount = blogCollection.countDocuments()
        await result.forEach( (doc) => 
        { 
           // console.log(doc)
            blogs.push(doc)
        })
        console.log(`Found ${await docCount} documents`)
        res.send(JSON.stringify(blogs))
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
    }

})

app.get('/posts/content/:searchWord', async(req,res) =>
{
    key=req.params.searchWord
    console.log(key)
    try
    {
        
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = blogCollection.find({content:{$regex: key , $options:'i'}})
        let docCount = blogCollection.countDocuments()
        await result.forEach( (doc) => 
        { 
           // console.log(doc)
            blogs.push(doc)
        })
        console.log(`Found ${await docCount} documents`)
        res.send(JSON.stringify(blogs))
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
    }

})


app.delete('/posts/user/:username',async(req,res) => 
{
    key=req.params.username
    console.log(key)
    try
    {
        
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = await blogCollection.deleteMany({username:key})

        console.log(`Deleted ${await result.deletedCount} documents`)
        res.send(`Deleted ${await result.deletedCount} documents`)
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
        res.send("ERROR !")
    }
})

app.delete('/posts/content/:searchWord',async(req,res) => 
{
    key=req.params.searchWord
    console.log(key)
    try
    {
        
        blogs=[]
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = await blogCollection.deleteMany({content:{$regex:key,$options:'i'}})
        console.log(`Deleted ${await result.deletedCount} documents`)
        res.send(`Deleted ${await result.deletedCount} documents`)
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
        res.send("ERROR !")
    }
})

app.get('/posts/count/:username', async(req,res) =>
{
    key=req.params.username
    try
    {
        blogs=[]
        console.log(req.params.username)
        const blogCollection = client.db(dbname).collection(collectionName)
        let result = blogCollection.find({username: key})
        
        //let docCount = blogCollection.countDocuments({username: key})
        console.log(`Found ${await result.Count} documents`)
        await result.forEach( (doc) => 
        { 
           // console.log(doc)
            blogs.push(doc)
        })
        tempResponse=
        {
            "username":key,
            "Count":blogs.length
        }

        res.send(JSON.stringify(tempResponse))
        
    }
    catch(err)
    {
        console.error(`Error finding document: ${err}`)
    }

})


app.listen(port, async ()=>{
    console.log(`Connected to the Express server on port ${port}`)
    await connectToDatabase()
})