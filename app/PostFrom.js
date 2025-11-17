import { LitElement, html, css } from "lit";

class PostForm extends LitElement{

    static properties = {
        isSubmitting : {type: Boolean}
    }

    constructor() {
        super();
        this.isSubmitting = false;
    }
    
static styles = css`
    .form-container {
      border: 1px solid #ccc;
      padding: 20px;
      margin-top: 20px;
      border-radius: 5px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #a0c9ff;
      cursor: not-allowed;
    }
  `;
    
    render() {
        return html`
            <div class="form-container">
                <h3>새 게시글 작성</h3>
                <form @submit=${this.handleSubmit}>
                    <input type="text" id="title" placeholder="제목" required />
                    <input type="text" id="author" placeholder="작성자" required />
                    <textarea id="content" placeholder="내용" rows="5" required></textarea>
                    <button type="submit" ?disabled=${this.isSubmitting}>
                        ${this.isSubmitting ? '저장 중..' : '게시글 등록'}
                    </button>
                </form>
            </div>
        `;
    }

    async handleSubmit(e){
        e.preventDefault();
        this.isSubmitting = true;

        const form = e.target;
        const newPost = {
            title: form.title.value,
            content: form.content.value,
            author: form.author.value,
            date: new Date().toISOString().split('T')[0],
        }
        
        try {
            const response = await fetch('http://localhost:3000/posts',{
                method:'POST',
                headers:{'Content-Type': 'application/json',},
                body:JSON.stringify(newPost),
            });

            if(!response.ok){
                throw new Error('게시글 등록 실패')
            }
            form.reset();
            // alert("게시글 등록 성공");
            // this.dispatchEvent(new CustomEvent('updated', { bubbles: true, composed: true }));
            this.dispatchEvent(new CustomEvent('post-created', { bubbles: true, composed: true }));
        } catch (error) {
            console.error('등록 오류:', error);
            alert(`게시글 등록 중 오류 발생: ${error.message}`);
        } finally {
            this.isSubmitting = false;
        }
    }
}
customElements.define('post-form',PostForm);