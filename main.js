import { LitElement, html, css } from "lit";
import './app/PostList.js'
import './app/PostFrom.js'
import './app/PostDetail.js'
import { ref, createRef } from 'lit/directives/ref.js';

class PostBoard extends LitElement{

    static properties = {
        showForm:{type:Boolean},
        selectedPostId:{type:Number}
    };
    postListRef = createRef();
    constructor(){
        super();
        this.showForm = false;
        this.selectedPostId = null;
    }
    static styles = css`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      position: relative;
    }
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
    }
    .create-button {
      padding: 10px 15px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 15px;
    }
  `;

    render() {
        return html`
            <button  class="create-button" @click=${this.openForm}>새 글 작성</button>

            <post-list ${ref(this.postListRef)} @post-selected=${this.handlePostSelected}></post-list>

            ${this.showForm ? html`
                <div class="modal-backdrop">
                    <div class="modal-content">
                        <button class="close-button" @click=${this.closeForm}>&times;</button>                    
                        ${this.selectedPostId ? 
                            html`
                                <post-detail postId=${this.selectedPostId}
                                    @post-updated=${this.handlePostCreated} 
                                    @post-deleted=${this.handlePostCreated}>
                                </post-detail>
                            `: html`
                                <post-form @post-created=${this.handlePostCreated}></post-form>
                            `
                        }
                    </div>
                </div>
            ` : ''}
        `;
    }

    setPostListRef(e) {
        console.log(e);
        
        this._postList = e.target;
    }

    openForm() {
        this.selectedPostId = null;
        this.showForm = true;
    }

    closeForm() {
        this.selectedPostId = null;
        this.showForm = false;
    }

    handlePostCreated() {
        const postListComponent = this.postListRef.value;
        
        if (postListComponent && postListComponent.fetchPosts) {
            postListComponent.fetchPosts(); 
        }
        this.closeForm();                             
    }
    handlePostSelected(e) {
        this.selectedPostId = e.detail.postId
        this.showForm = true;
    }
}
customElements.define('post-board',PostBoard);