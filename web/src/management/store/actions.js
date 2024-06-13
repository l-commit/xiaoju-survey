import { getBannerData } from '@/management/api/skin.js'
import { getCollaboratorPermissionsMemorize } from '@/management/api/space.ts'
import { CODE_MAP } from '../api/base'

export default {
  async getBannerData({ state, commit }) {
    if (state.bannerList && state.bannerList.length > 0) {
      return
    }
    const res = await getBannerData()
    if (res.code === 200) {
      commit('setBannerList', res.data)
    }
  },
  async fetchCooperPermissions({ commit }, id) {
    const res = await getCollaboratorPermissionsMemorize(id)
    if (res.code === CODE_MAP.SUCCESS) {
      commit('setCooperPermissions', res.data.permissions)
    }
  }
}
