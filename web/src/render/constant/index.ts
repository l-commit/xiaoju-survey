export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BINARY_CHOICE = 'binary-choice',
  RADIO_STAR = 'radio-star',
  RADIO_NPS = 'radio-nps',
  VOTE = 'vote',
}

// 输入类题型
export const INPUT = [
  QUESTION_TYPE.TEXT,
  QUESTION_TYPE.TEXTAREA
]

// 选择类题型分类
export const NORMAL_CHOICES =  [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX
]
// 评分题题型分类
export const RATES = [
  QUESTION_TYPE.RADIO_STAR,
  QUESTION_TYPE.RADIO_NPS
]
