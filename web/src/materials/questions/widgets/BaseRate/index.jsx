import { defineComponent, computed } from 'vue'
import '../../common/css/radioStar.scss'
export default defineComponent({
  name: 'BaseRate',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: 0
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    iconClass: {
      type: String,
      default: 'number'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const rating = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('change', val)
      }
    })
    const range = computed(() => {
      const { min, max } = props
      if (min > max) {
        return []
      }
      const res = []
      for (let i = min; i <= max; i++) {
        res.push(i)
      }
      return res
    })
    const handleClick = (num) => {
      if (props.readonly) return
      rating.value = num
    }
    return {
      rating,
      range,
      handleClick
    }
  },
  render() {
    const { rating, range, iconClass } = this

    return (
      <div class="star-wrapper-main">
        <div class="star-box">
          {range.map((num, index) => {
            return (
              <div
                class={['star-item', num <= rating ? 'on' : 'off', iconClass]}
                key={'star' + index}
                onClick={() => {
                  this.handleClick(num)
                }}
              >
                {iconClass === 'number' ? num : ''}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
