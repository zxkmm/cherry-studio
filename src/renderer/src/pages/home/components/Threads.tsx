import { FC } from 'react'
import styled from 'styled-components'
import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown } from '@douyinfe/semi-ui'
import useThreads from '@renderer/hooks/useThreads'

const Threads: FC = () => {
  const { threads, activeThread, setActiveThread, removeThread } = useThreads()

  return (
    <Container>
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          onClick={() => setActiveThread(thread)}
          className={thread.id === activeThread?.id ? 'active' : ''}>
          <Dropdown
            trigger="click"
            render={
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={(event) => {
                    removeThread(thread.id)
                    event.stopPropagation()
                  }}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            }>
            <IconMore style={{ position: 'absolute', right: 12, top: 12 }} />
          </Dropdown>
          <ThreadTime>{thread.lastMessageAt}</ThreadTime>
          <ThreadName>{thread.name}</ThreadName>
          <ThreadLastMessage>{thread.lastMessage}</ThreadLastMessage>
        </ThreadItem>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: var(--conversations-width);
  border-right: 1px solid #ffffff20;
  height: calc(100vh - var(--navbar-height));
  padding: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
  cursor: pointer;
  .semi-icon {
    display: none;
  }
  &:hover {
    background-color: var(--color-background-soft);
    .semi-icon {
      display: block;
    }
  }
  &.active {
    background-color: var(--color-background-mute);
    cursor: pointer;
  }
  border-radius: 8px;
  margin-bottom: 10px;
`

const ThreadTime = styled.div`
  font-size: 12px;
  color: var(--color-text-2);
`

const ThreadName = styled.div`
  font-size: 14px;
  color: var(--color-text-1);
  font-weight: bold;
`

const ThreadLastMessage = styled.div`
  font-size: 12px;
  color: var(--color-text-2);
`

export default Threads