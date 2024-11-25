import { CheckOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { HStack } from '@renderer/components/Layout'
import Scrollbar from '@renderer/components/Scrollbar'
import { DEFAULT_CONTEXTCOUNT, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '@renderer/config/constant'
import { codeThemes } from '@renderer/context/SyntaxHighlighterProvider'
import { useAssistant } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { SettingDivider, SettingRow, SettingRowTitle, SettingSubtitle } from '@renderer/pages/settings'
import { useAppDispatch } from '@renderer/store'
import {
  setClickAssistantToShowTopic,
  setCodeCollapsible,
  setCodeShowLineNumbers,
  setCodeStyle,
  setFontSize,
  setMathEngine,
  setMessageFont,
  setMessageStyle,
  setPasteLongTextAsFile,
  setRenderInputMessageAsMarkdown,
  setShowInputEstimatedTokens,
  setShowMessageDivider,
  setShowTopicTime
} from '@renderer/store/settings'
import { Assistant, AssistantSettings, ThemeMode } from '@renderer/types'
import { Col, Row, Select, Slider, Switch, Tooltip } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  assistant: Assistant
}

const SettingsTab: FC<Props> = (props) => {
  const { assistant, updateAssistantSettings, updateAssistant } = useAssistant(props.assistant.id)
  const { messageStyle, codeStyle, fontSize } = useSettings()

  const [temperature, setTemperature] = useState(assistant?.settings?.temperature ?? DEFAULT_TEMPERATURE)
  const [contextCount, setContextCount] = useState(assistant?.settings?.contextCount ?? DEFAULT_CONTEXTCOUNT)
  const [enableMaxTokens, setEnableMaxTokens] = useState(assistant?.settings?.enableMaxTokens ?? false)
  const [maxTokens, setMaxTokens] = useState(assistant?.settings?.maxTokens ?? 0)
  const [fontSizeValue, setFontSizeValue] = useState(fontSize)
  const [streamOutput, setStreamOutput] = useState(assistant?.settings?.streamOutput ?? true)
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const {
    showMessageDivider,
    messageFont,
    showInputEstimatedTokens,
    sendMessageShortcut,
    setSendMessageShortcut,
    pasteLongTextAsFile,
    renderInputMessageAsMarkdown,
    codeShowLineNumbers,
    codeCollapsible,
    mathEngine,
    topicPosition,
    showTopicTime,
    clickAssistantToShowTopic,
    setTopicPosition
  } = useSettings()

  const onUpdateAssistantSettings = (settings: Partial<AssistantSettings>) => {
    updateAssistantSettings(settings)
  }

  const onTemperatureChange = (value) => {
    if (!isNaN(value as number)) {
      onUpdateAssistantSettings({ temperature: value })
    }
  }

  const onContextCountChange = (value) => {
    if (!isNaN(value as number)) {
      onUpdateAssistantSettings({ contextCount: value })
    }
  }

  const onMaxTokensChange = (value) => {
    if (!isNaN(value as number)) {
      onUpdateAssistantSettings({ maxTokens: value })
    }
  }

  const onReset = () => {
    setTemperature(DEFAULT_TEMPERATURE)
    setContextCount(DEFAULT_CONTEXTCOUNT)
    updateAssistant({
      ...assistant,
      settings: {
        ...assistant.settings,
        temperature: DEFAULT_TEMPERATURE,
        contextCount: DEFAULT_CONTEXTCOUNT,
        enableMaxTokens: false,
        maxTokens: DEFAULT_MAX_TOKENS,
        streamOutput: true,
        hideMessages: false,
        autoResetModel: false
      }
    })
  }

  useEffect(() => {
    setTemperature(assistant?.settings?.temperature ?? DEFAULT_TEMPERATURE)
    setContextCount(assistant?.settings?.contextCount ?? DEFAULT_CONTEXTCOUNT)
    setEnableMaxTokens(assistant?.settings?.enableMaxTokens ?? false)
    setMaxTokens(assistant?.settings?.maxTokens ?? DEFAULT_MAX_TOKENS)
    setStreamOutput(assistant?.settings?.streamOutput ?? true)
  }, [assistant])

  return (
    <Container>
      <SettingGroup style={{ marginTop: 10 }}>
        <SettingSubtitle style={{ marginTop: 0 }}>
          {t('settings.messages.model.title')}{' '}
          <Tooltip title={t('chat.settings.reset')}>
            <ReloadOutlined onClick={onReset} style={{ cursor: 'pointer', fontSize: 12, padding: '0 3px' }} />
          </Tooltip>
        </SettingSubtitle>
        <SettingDivider />
        <Row align="middle">
          <Label>{t('chat.settings.temperature')}</Label>
          <Tooltip title={t('chat.settings.temperature.tip')}>
            <QuestionIcon />
          </Tooltip>
        </Row>
        <Row align="middle" gutter={10}>
          <Col span={24}>
            <Slider
              min={0}
              max={2}
              onChange={setTemperature}
              onChangeComplete={onTemperatureChange}
              value={typeof temperature === 'number' ? temperature : 0}
              step={0.1}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Label>{t('chat.settings.context_count')}</Label>
          <Tooltip title={t('chat.settings.context_count.tip')}>
            <QuestionIcon />
          </Tooltip>
        </Row>
        <Row align="middle" gutter={10}>
          <Col span={24}>
            <Slider
              min={0}
              max={20}
              onChange={setContextCount}
              onChangeComplete={onContextCountChange}
              value={typeof contextCount === 'number' ? contextCount : 0}
              step={1}
            />
          </Col>
        </Row>
        <SettingRow>
          <SettingRowTitleSmall>{t('model.stream_output')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={streamOutput}
            onChange={(checked) => {
              setStreamOutput(checked)
              onUpdateAssistantSettings({ streamOutput: checked })
            }}
          />
        </SettingRow>
        <SettingDivider />
        <Row align="middle" justify="space-between">
          <HStack alignItems="center">
            <Label>{t('chat.settings.max_tokens')}</Label>
            <Tooltip title={t('chat.settings.max_tokens.tip')}>
              <QuestionIcon />
            </Tooltip>
          </HStack>
          <Switch
            size="small"
            checked={enableMaxTokens}
            onChange={(enabled) => {
              setEnableMaxTokens(enabled)
              onUpdateAssistantSettings({ enableMaxTokens: enabled })
            }}
          />
        </Row>
        <Row align="middle" gutter={10}>
          <Col span={24}>
            <Slider
              disabled={!enableMaxTokens}
              min={0}
              max={32000}
              onChange={setMaxTokens}
              onChangeComplete={onMaxTokensChange}
              value={typeof maxTokens === 'number' ? maxTokens : 0}
              step={100}
            />
          </Col>
        </Row>
      </SettingGroup>
      <SettingGroup>
        <SettingSubtitle style={{ marginTop: 0 }}>{t('settings.messages.title')}</SettingSubtitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.divider')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={showMessageDivider}
            onChange={(checked) => dispatch(setShowMessageDivider(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.use_serif_font')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={messageFont === 'serif'}
            onChange={(checked) => dispatch(setMessageFont(checked ? 'serif' : 'system'))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('chat.settings.show_line_numbers')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={codeShowLineNumbers}
            onChange={(checked) => dispatch(setCodeShowLineNumbers(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('chat.settings.code_collapsible')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={codeCollapsible}
            onChange={(checked) => dispatch(setCodeCollapsible(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('message.message.style')}</SettingRowTitleSmall>
          <Select
            value={messageStyle}
            onChange={(value) => dispatch(setMessageStyle(value))}
            style={{ width: 135 }}
            size="small">
            <Select.Option value="plain">{t('message.message.style.plain')}</Select.Option>
            <Select.Option value="bubble">{t('message.message.style.bubble')}</Select.Option>
          </Select>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('message.message.code_style')}</SettingRowTitleSmall>
          <Select
            value={codeStyle}
            onChange={(value) => dispatch(setCodeStyle(value))}
            style={{ width: 135 }}
            size="small">
            {codeThemes.map((theme) => (
              <Select.Option key={theme} value={theme}>
                {theme}
              </Select.Option>
            ))}
          </Select>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.math_engine')}</SettingRowTitleSmall>
          <Select
            value={mathEngine}
            onChange={(value) => dispatch(setMathEngine(value))}
            style={{ width: 135 }}
            size="small">
            <Select.Option value="KaTeX">KaTeX</Select.Option>
            <Select.Option value="MathJax">MathJax</Select.Option>
          </Select>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.font_size.title')}</SettingRowTitleSmall>
        </SettingRow>
        <Row align="middle" gutter={10}>
          <Col span={24}>
            <Slider
              value={fontSizeValue}
              onChange={(value) => setFontSizeValue(value)}
              onChangeComplete={(value) => dispatch(setFontSize(value))}
              min={12}
              max={22}
              step={1}
              marks={{
                12: <span style={{ fontSize: '12px' }}>A</span>,
                14: <span style={{ fontSize: '14px' }}>{t('common.default')}</span>,
                22: <span style={{ fontSize: '18px' }}>A</span>
              }}
            />
          </Col>
        </Row>
      </SettingGroup>
      <SettingGroup>
        <SettingSubtitle style={{ marginTop: 0 }}>{t('settings.messages.input.title')}</SettingSubtitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.input.show_estimated_tokens')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={showInputEstimatedTokens}
            onChange={(checked) => dispatch(setShowInputEstimatedTokens(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.input.paste_long_text_as_file')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={pasteLongTextAsFile}
            onChange={(checked) => dispatch(setPasteLongTextAsFile(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.markdown_rendering_input_message')}</SettingRowTitleSmall>
          <Switch
            size="small"
            checked={renderInputMessageAsMarkdown}
            onChange={(checked) => dispatch(setRenderInputMessageAsMarkdown(checked))}
          />
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitleSmall>{t('settings.messages.input.send_shortcuts')}</SettingRowTitleSmall>
          <Select
            size="small"
            value={sendMessageShortcut}
            menuItemSelectedIcon={<CheckOutlined />}
            options={[
              { value: 'Enter', label: 'Enter' },
              { value: 'Shift+Enter', label: `Shift + Enter` }
            ]}
            onChange={(value) => setSendMessageShortcut(value)}
            style={{ width: 135 }}
          />
        </SettingRow>
        <SettingDivider />
        <SettingSubtitle>{t('settings.display.title')}</SettingSubtitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.position')}</SettingRowTitle>
          <Select
            defaultValue={topicPosition || 'right'}
            style={{ width: 135 }}
            onChange={setTopicPosition}
            size="small"
            options={[
              { value: 'left', label: t('settings.topic.position.left') },
              { value: 'right', label: t('settings.topic.position.right') }
            ]}
          />
        </SettingRow>
        <SettingDivider />
        {topicPosition === 'left' && (
          <>
            <SettingRow>
              <SettingRowTitle>{t('settings.advanced.auto_switch_to_topics')}</SettingRowTitle>
              <Switch
                size="small"
                checked={clickAssistantToShowTopic}
                onChange={(checked) => dispatch(setClickAssistantToShowTopic(checked))}
              />
            </SettingRow>
            <SettingDivider />
          </>
        )}
        <SettingRow>
          <SettingRowTitle>{t('settings.topic.show.time')}</SettingRowTitle>
          <Switch size="small" checked={showTopicTime} onChange={(checked) => dispatch(setShowTopicTime(checked))} />
        </SettingRow>
      </SettingGroup>
    </Container>
  )
}

const Container = styled(Scrollbar)`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 10px;
  padding-right: 5px;
  padding-top: 2px;
`

const Label = styled.p`
  margin: 0;
  font-size: 12px;
  margin-right: 5px;
`

const QuestionIcon = styled(QuestionCircleOutlined)`
  font-size: 12px;
  cursor: pointer;
  color: var(--color-text-3);
`

const SettingRowTitleSmall = styled(SettingRowTitle)`
  font-size: 13px;
`

export const SettingGroup = styled.div<{ theme?: ThemeMode }>`
  padding: 10px;
  width: 100%;
  margin-top: 0;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 0.5px solid var(--color-border);
  background: var(--color-group-background);
`

export default SettingsTab