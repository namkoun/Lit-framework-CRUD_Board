import { LitElement, html, css, } from "lit";
import { repeat } from "lit/directives/repeat.js";

class PostDetail extends LitElement{

    
    static properties = {
        postId : {type:Number,reflect:true},
        post : {type:Object},
        isEditMode : {type:Boolean},
        loading:{type:Boolean}
    };

    constructor(){
            // console.log("1",properties)
        super();
        this.post = null;
        this.isEditMode = false;
        this.loading = false;
    }

    willUpdate(changedProperties){
        if (changedProperties.has('postId') && this.postId) {
            this.fetchPost(this.postId);
            this.isEditMode = false;
        }
    }

    async fetchPost(id){
        this.loading = true;
        try {
            console.log("id",id);
            
            const response = await fetch(`http://localhost:3000/posts/${id}`);
            if (!response.ok) throw new Error('게시글을 찾을 수 없습니다.');
            this.post = await response.json();
        } catch (error) {
            console.error('Fetch 오류:', error);
            this.post = null;
        }finally{
            this.loading = false;
        }
    }

    toggleEditMode(){
        this.isEditMode = !this.isEditMode;
    }

    async handleUpdate(e){
        e.preventDefault();
        this.loading = true;
        const form = e.target;
        const updatedPost = {
            ...this.post,
            title:form.title.value,
            content:form.content.value
        }
    
        try {
            const response = await fetch(`http://localhost:3000/posts/${this.postId}`, {
                method: 'PUT', // 전체 업데이트를 위한 PUT 메서드 (PATCH도 가능)
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost),
            });

            if (!response.ok) throw new Error('게시글 수정에 실패했습니다.');

             // 성공적으로 수정된 데이터로 post 상태 업데이트 및 수정 모드 해제
            this.post = await response.json();
            this.isEditMode = false;
            alert('게시글이 성공적으로 수정되었습니다.');

            // 목록 갱신을 위해 부모에게 이벤트 전달
            this.dispatchEvent(new CustomEvent('post-updated', { bubbles: true, composed: true }));

        } catch (error) {
           console.error('수정 오류:', error);
            alert(`게시글 수정 중 오류 발생: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }


    async handleDelete(){
        if (!confirm('삭제 하시겠습니까?')) return;

        this.loading = true;

        try {
            const response = await fetch(`http://localhost:3000/posts/${this.postId}`,{
                method:'DELETE',
            });
            
            if (!response.ok) throw new Error("게시글 삭제 실패");

            this.dispatchEvent(new CustomEvent('post-deleted',{bubbles:true,composed:true}))
        } catch (error) {
            console.error('삭제 오류:', error);
            alert(`게시글 삭제 중 오류 발생: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }

    render(){
        if(this.loading){
            return html`<p>데이터를 불러오는중</p>`
        }
        if (!this.post) {
            return html`<p>선택된 게시글이 없거나 5465존재하지 않습니다.</p>`
        }

        if (this.isEditMode) {
            return html`
                <div class="detail-container">
                    <h3>게시글 수정</h3>
                    <form class="edit-form" @submit=${this.handleUpdate}>
                        <input type="text" id="title" .value=${this.post.title} required />
                        <p>작성자 : ${this.post.author}</p>
                        <textarea id="content" row="10" required>${this.post.content}</textarea>

                        <button type="submit" ?disabled=${this.loading}>수정 완료</button>
                        <button type="button" @click=${this.toggleEditMode}>취소</button>
                    </form>
                </div>
            `;
        }

        return html`
            <div class="detail-container">
                <div class="header">
                    <h3>${this.post.title}</h3>
                    <p>작성자: ${this.post.author} | 날짜: ${this.post.date}</p>
                </div>
                <div class="content">${this.post.content}</div>
                <div>
                    <button @click=${this.toggleEditMode}>수정</button>
                    <button @click=${this.handleDelete}>삭제</button>
                    <button @click=${() => this.dispatchEvent(new CustomEvent('post-deleted', { bubbles: true, composed: true }))}>닫기</button>
                </div>
            </div>
        `;
    }
    static styles = css`
        .detail-container { padding: 20px; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .header h3 { margin: 0; }
        .header p { margin: 5px 0 0 0; color: #666; font-size: 0.9em; }
        .content { white-space: pre-wrap; margin-bottom: 20px; }
        button { padding: 8px 12px; margin-right: 5px; cursor: pointer; }
        
        .edit-form input, .edit-form textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
    `;
}

customElements.define('post-detail',PostDetail);