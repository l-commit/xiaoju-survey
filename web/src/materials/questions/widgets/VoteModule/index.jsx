import { computed, defineComponent } from 'vue'
import { includes } from 'lodash-es'

import AnswerProcess from './AnswerProcess/index.vue'
import BaseChoice from '../BaseChoice'

import './style.scss'

export default defineComponent({
  name: 'VoteModule',
  components: { BaseChoice, AnswerProcess },
  props: {
    innerType: {
      type: String,
      default: 'radio'
    },
    field: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
    },
    layout: {
      type: String,
      default: 'vertical'
    },
    options: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    voteTotal: {
      type: Number,
      default: 10
    },
    maxNum: {
      type: [Number, String],
      default: 1
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const disableState = computed(() => {
      if (!props.maxNum) {
        return false
      }
      return props.value.length >= +props.maxNum
    })
    const isDisabled = (item) => {
      const { value } = props
      return disableState.value && !includes(value, item.value)
    }
    const myOptions = computed(() => {
      const { options } = props
      if (props.innerType === 'checkbox') {
        return options.map((item) => {
          return {
            ...item,
            disabled: isDisabled(item)
          }
        })
      } else {
        return options
      }
    })
    const calcVotePercent = (option, total) => {
      const { voteCount = 0 } = option
      const voteTotal = total || 0

      if (voteTotal === 0) {
        return '0.0'
      }
      return ((voteCount * 100) / voteTotal).toFixed(1)
    }
    const onChange = (value) => {
      const key = props.field
      emit('change', {
        key,
        value
      })
    }
    const handleSelectMoreChange = (data) => {
      const { key, value } = data
      emit('change', {
        key,
        value
      })
    }
    return {
      props,
      myOptions,
      calcVotePercent,
      onChange,
      handleSelectMoreChange
    }
  },
  render() {
    const { calcVotePercent, innerType, props } = this

    return (
      <BaseChoice
        uiTarget={innerType}
        layout={'vertical'}
        name={props.field}
        innerType={props.innerType}
        value={props.value}
        options={props.options}
        readonly={props.readonly}
        voteTotal={props.voteTotal}
        maxNum={props.maxNum}
        onChange={this.onChange}
      >
        {{
          vote: (scoped) => {
            return (
              <div class="vote-detail">
                <AnswerProcess
                  process-conf={{
                    percent: `${calcVotePercent(scoped.option, scoped.voteTotal)}%`
                  }}
                />
                <div class="vote-percent">{`${calcVotePercent(
                  scoped.option,
                  scoped.voteTotal
                )}%`}</div>
                <div class="vote-count">{`${scoped.option.voteCount || 0}票`}</div>
              </div>
            )
          }
        }}
      </BaseChoice>
    )
  }
})
