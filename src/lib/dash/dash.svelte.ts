import type { Group, Member, System } from "$api/types"

export enum PrivacyMode {
  PUBLIC,
  PRIVATE,
  SCOPED,
}

export let dash = createDash()

function createDash() {
  let privacyMode: PrivacyMode = $state(PrivacyMode.PRIVATE)
  let systemData = $state(createSystemState())
  let memberList = $state(createMemberListState())
  let groupList = $state(createGroupListState())
  return {
    get members() {
      return memberList.members
    },
    get groups() {
      return groupList.groups
    },
    get system() {
      return systemData.system
    },
    get privacyMode() {
      return privacyMode
    },
    init: (system: System, members: Member[], groups: Group[], mode: PrivacyMode) => {
      systemData.init(system)
      memberList.init(members)
      groupList.init(groups)
      privacyMode = mode
    },
    initSystem: (system: System) => {
      systemData.init(system)
    },
  }
}

function createSystemState() {
  let system: System = $state({})
  return {
    get system() {
      return system
    },
    init: (data: System) => (system = data),
  }
}

function createMemberListState() {
  let members: Member[] = $state([])
  return {
    get members() {
      return members
    },
    init: (data: Member[]) => (members = data),
  }
}

function createGroupListState() {
  let groups: Group[] = $state([])
  return {
    get groups() {
      return groups
    },
    init: (data: Group[]) => (groups = data),
  }
}
