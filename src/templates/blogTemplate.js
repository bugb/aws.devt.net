import React from 'react'
import {useRef, useEffect} from 'react'
import { graphql } from 'gatsby'
import Comment from '../components/comment'
 
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const commentBox = React.createRef()

  useEffect(() => {
    console.log("chaugiang")
    const scriptEl = document.createElement('script')
    scriptEl.async = true
    scriptEl.src = 'https://utteranc.es/client.js'
    scriptEl.setAttribute('repo', 'bugb/aws.devt.net-comments')
    scriptEl.setAttribute('issue-term', 'title')
    scriptEl.setAttribute('id', 'utterances')
    scriptEl.setAttribute('theme', 'github-light')
    scriptEl.setAttribute('crossorigin', 'anonymous')
    if (commentBox && commentBox.current) {
      commentBox.current.appendChild(scriptEl)
    } else {
      console.log({commentBox})
      console.log(`Error adding utterances comments on: ${commentBox}`)
    }
  }, [])
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html, excerpt } = markdownRemark
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        { excerpt? <></>: <Comment commentBox={commentBox} />}
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
