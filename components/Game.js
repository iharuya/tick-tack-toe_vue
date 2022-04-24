export default {
	data() {
		return {
			nextIsX: true,
			status: null,
			board: Array(9).fill(null),
			ended: false,
			boxSize: null,
		}
	},

	methods: {
		updateGame() {
			const winner = this.checkGame(this.board)
			if (winner) {
				this.status = `${winner} won!`
				this.ended = true
				return
			}
			this.status = this.nextIsX ? "Turn: x" : "Turn: o"
		},

		updateBox(idx) {
			if (this.ended || this.board[idx]) return
			this.board[idx] = this.nextIsX ? "x" : "o"
			this.nextIsX = !this.nextIsX
			this.updateGame()
		},

		checkGame(board) {
			const lines = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6],
			]
			for (let i = 0; i < lines.length; i++) {
				const [a ,b ,c] = lines[i]
				if (board[a] && board[a] === board[b] && board[a] === board[c]) {
					return board[a]
				}
			}
			return null
		},

		reset() {
			this.board = Array(9).fill(null)
			this.ended = false
			this.updateGame()
		}
	},

	mounted() {
		this.updateGame()
		this.boxSize = this.$refs.box[0].clientWidth
	},

	template: /*html*/`
	<div class="game--header">
		<div class="game--header__status">{{status}}</div>
		<div class="game--header__control">
			<button class="game--header__control--button" @click="reset">Reset</button>
		</div>
	</div>
	<div class="game--board" :class="{ 'ended': ended }">
		<div 
			v-for="content, idx in board"
			class="game--board__box"
			@click="updateBox(idx)"
			ref="box"
			:style="{
				'font-size': boxSize - 16 + 'px',
				'color': content === 'x' ? '#F44336' : '#2196F3'
			}"
		>{{content}}</div>
	</div>
	<div class="game--info">
		
	</div>
	`


}