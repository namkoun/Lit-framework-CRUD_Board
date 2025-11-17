import { LitElement, html, css } from "lit";

class PostList extends LitElement{
    
    static properties = {
        posts: {type: Array},
        loading: {type: Boolean},
    };

    // 초기화
    constructor() {
        super();
        this.posts = [];
        this.loading = true;
        this.fetchPosts();
    }

    // api 가져오기
    async fetchPosts() {
        try {
            const response = await fetch('http://localhost:3000/posts');
            console.log(response);
            this.posts = await response.json();
            if(!response.ok){
                throw new Error(`http 오류! 상태 : ${response.status}`)
            }
        } catch (error) {
            console.error("게시글 불러오는중 오류",error)
        } finally{
            this.loading = false
        }
    }

    static styles = css`
        ul {list-style:none; padding:0;}
        li {
            border: 1px solid #ddd;
            padding:10px;
            margin-bottom:8px;
            display: flex;
            justify-content: space-between;
            align-items: center;  
        }
        .list-btn{
            padding: 10px;
            background-color: #0099d9;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `;

     render(){
        if(this.loading){
            return html`<p>게시글을 불러오는 중입니다..</p>`
        }
        
        if(this.posts.length === 0){
            return html`<p>게시글이 없습니다. 새글을 작성하세요</p>`
        }

        return html`
            <h2>게시글 목록</h2>
            <div>
                <ul>
                    ${this.posts.map(post => html`
                        <li>
                            <div>
                                <strong>${post.title}</strong> - <small>${post.author} (${post.date})</small>
                            </div>
                            <div>
                                <button class="list-btn" @click=${() => this.viewPost(post.id)}>상세보기</button>
                            </div>
                        </li>
                            `)}
                </ul>
            </div>
        `
     }

    viewPost(id){
        this.dispatchEvent(new CustomEvent('post-selected',{
            detail:{postId:id},
            bubbles:true,
            composed:true
        }))
    }
}
customElements.define('post-list',PostList);