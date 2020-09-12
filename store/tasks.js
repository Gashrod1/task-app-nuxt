import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
    columns: {},
    unassignedTasks: [],
    title: ''
})

export const mutations = {
    SET_TASKS(state, tasks) {
        const columnsObj = {}
        let columnKey = 0

        tasks.forEach((task) => {
            const columnName = task.status

            if (columnsObj.hasOwnProperty(task.status)) {
                columnsObj[columnName].tasks.push(task)
            } else {
                columnsObj[columnName] = {
                    key: columnKey,
                    title: columnName,
                    tasks: []
                }
                columnKey++
            }
        })
        // puts the tasks in order by their 'index' value
        Object.keys(columnsObj).forEach((columnTitle) => {
            columnsObj[columnTitle].tasks.sort((a, b) => a.index > b.index)
        })

        state.columns = columnsObj
    },
    SET_UNASSIGNED_TASKS(state, tasks) {
        state.unassignedTasks = tasks
    },
    SET_TASK(state, task) {
        state.task = task
    },
    ADD_TASK(state, task) {
        if (task.assignee === this.$auth.user._id) {
            const column = state.columns[task.status]
            column.tasks.push(task)

            Vue.set(state.columns, task.status, column)
        } else {
            state.unassignedTasks.push(task)
        }
    },
    UPDATE_TASK(state, taskToEdit) {
        if (taskToEdit.assignee === this.$auth.user._id) {
            const column = state.columns[taskToEdit.status]
            column.tasks = column.tasks.map((task) => {
                if (task._id === taskToEdit._id) {
                    return taskToEdit
                } else {
                    return task
                }
            })

            Vue.set(state.columns, taskToEdit.status, column)
        } else {
            state.unassignedTasks = state.unassignedTasks.map((task) => {
                if (task._id === taskToEdit._id) {
                    return taskToEdit
                } else {
                    return task
                }
            })
        }
    },
    MOVE_TASK(state, payload) {
        const { fromColumnTasks, toColumnTasks } = payload

        Vue.set(state.columns, fromColumnTasks.title, fromColumnTasks)
        Vue.set(state.columns, toColumnTasks.title, toColumnTasks)
    },
    DELETE_TASK(state, taskId) {
        Object.values(state.columns).forEach((column) => {
            column.tasks.forEach((task, i) => {
                if (task._id === taskId) {
                    column.tasks.splice(i, 1)
                    Vue.set(state.columns, task.status, column)
                }
            })
        })

        state.unassignedTasks.forEach((task, i) => {
            if (task._id === taskId) {
                state.unassignedTasks.splice(i, 1)
            }
        })
    },
    SET_TITLE(state, title) {
        state.title = title
    }
}
export const actions = {
    fetchTasks({ commit }) {
        return axios.get('api/tasks').then((response) => {
            commit('SET_TASKS', response.data)
        })
    },
    fetchUnassignedTasks({ commit }) {
        return axios.get('api/tasks/unassigned').then((response) => {
            commit('SET_UNASSIGNED_TASKS', response.data)
        })
    },
    // fetchTask({ commit }, id) {
    //     return axios.get('api/tasks/:id', id).then((response) => {
    //         commit('SET_TASK', response.data)
    //     })
    // },
    addTask({ commit }, task) {
        return axios.post('api/tasks', task).then((response) => {
            commit('ADD_TASK', response.data.newTask)
        })
    },
    updateTask({ commit }, payload) {
        return axios.put('api/tasks', payload).then((response) => {
            commit('UPDATE_TASK', response.data.updatedTask)
        })
    },
    moveTask({ commit }, payload) {
        return axios.put('api/tasks/move', payload).then((response) => {
            const { fromColumnTasks, toColumnTasks } = response.data

            commit('MOVE_TASK', {
                fromColumnTasks,
                toColumnTasks
            })
        })
    },
    deleteTask({ commit }, taskId) {
        return axios.post('api/tasks/delete', { taskId }).then((response) => {
            commit('DELETE_TASK', response.data.taskId)
        })
    }
}
export const getters = {
    getColumns(state) {
        return state.columns
    },
    getTitle(state) {
        return state.title
    },
    getUnassignedTasks(state) {
        return state.unassignedTasks
    }
}
