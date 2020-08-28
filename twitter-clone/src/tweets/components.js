import React, { useEffect, useState } from 'react'

import { loadTweets } from '../lookup'


export function TweetsComponent(props) {
    const textAreaRef = React.createRef()
    const [newTweets, setNewTweets] = useState([])
    const handleSubmit = e => {
        e.preventDefault()
        const newVal = textAreaRef.current.value
        let tempNewTweets = [...newTweets]
        tempNewTweets.unshift({
            content: newVal,
            likes: 0,
            id: 19237
        })
        setNewTweets(tempNewTweets)
        console.log(newVal)
        textAreaRef.current.value = ''

    }
    return (
        <div className={props.className} >
            <div className='col-12 mb-3 mt-3 ' >
                <form onSubmit={handleSubmit} >
                    <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'></textarea>
                    <button type='submit' className='btn btn-primary my-3' >Tweet</button>
                </form>
            </div>
            <TweetsList newTweets={newTweets} />
        </div>
    )


}

export const TweetsList = (props) => {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])

    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [tweetsInit, props.newTweets, tweets])

    useEffect(() => {
        const myCallback = (response, status) => {
            if (status === 200) {
                setTweetsInit(response)
            } else {
                alert("There was an error")
            }
        }
        loadTweets(myCallback)

    }, [])
    return tweets.map((item, index) => {
        return <Tweet tweet={item} key={`${index}-${item.id}`} className='my-5 py-5 bg-white text-dark' />
    })
}

export function ActionBtn(props) {
    const { tweet, action } = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
    const display = action.type == 'like' ? `${likes} ${actionDisplay}` : actionDisplay

    const handleClick = (e) => {
        e.preventDefault()
        if (action.type === 'like') {
            if (userLike === true) {
                // perhaps i unlike it?
                setUserLike(false)
                setLikes(likes - 1)
            } else {
                setUserLike(true)
                setLikes(likes + 1)
            }

        }
    }
    return <button className={className} onClick={handleClick} >{display}</button>
}

export const Tweet = (props) => {
    const { tweet } = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return <div className={className} >
        <p> {tweet.id} - {tweet.content}</p>
        <div className='btn btn-group' >
            <ActionBtn tweet={tweet} action={{ type: "like", display: "Likes" }} />
            <ActionBtn tweet={tweet} action={{ type: "unlike", display: "Unlike" }} />
            <ActionBtn tweet={tweet} action={{ type: "retweet", display: "Retweet" }} />
        </div>
    </div>
}