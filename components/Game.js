export default {
	data() {
		return {
			nextIsX: true,
			status: null,
			board: Array(9).fill(null),
			history: [],
			ended: false,
			boxSize: null,
		}
	},

	computed: {
		turn() {
			return this.nextIsX ? "x" : "o"
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
			// if all boxes are determined
			if (this.board.every((i) => i)) {
				this.status = `Draw`
				this.ended = true
				return
			}
			this.status = "Turn: " + this.turn
		},

		updateBox(idx) {
			if (this.ended || this.board[idx]) return
			this.board[idx] = this.turn
			const coord = this.idxToCoord(idx)
			const explanation = `(${coord[0]}, ${coord[1]}) by ${this.turn}`
			this.history.push({
				turn: this.turn.slice(),
				board: [...this.board],
				explanation
			})
			this.nextIsX = !this.nextIsX
			this.updateGame()
		},

		backTo(idx) {
			// player cannot go back to the latest step
			if (idx === this.history.length - 1) return
			const step = this.history[idx]
			this.board = step.board
			this.nextIsX = !step.turn === 'x'
			this.history.splice(idx+1)
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

		idxToCoord(idx) {
			/*
			0 1 2
			3 4 5
			6 7 8

			0: (0, 0)
			7: (2, 1)
			*/
			const line = Math.floor(idx / 3)
			const row = idx % 3
			return [line, row]
		},

		reset() {
			this.board = Array(9).fill(null)
			this.history = []
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
	<div class="game--info container">
		<div class="game--info__history">
			<h2 class="game--info__history--title">Previous steps</h2>
			<div class="game--info__history--steps container">
				<button 
					class="game--info__history--step"
					v-for="(step, idx) in history"
					@click="backTo(idx)"
					:disabled="ended"
				>
					{{step.explanation}}
				</button>
			</div>
		</div>
	</div>
	`


}