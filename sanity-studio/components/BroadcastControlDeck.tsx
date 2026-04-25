import React, { useState, useEffect } from 'react'
import { Stack, Box, Flex, Text, Button, Card, Grid, Badge, useToast, Spinner, Inline, Label } from '@sanity/ui'
import { RocketIcon, PublishIcon, CheckmarkCircleIcon, ErrorOutlineIcon } from '@sanity/icons'
import { useFormValue, useClient, set } from 'sanity'

/**
 * BROADCAST CONTROL DECK
 * The central UI for multi-channel content distribution.
 * This component runs the 'Relay Mission' by contacting the Next.js engines.
 */
export const BroadcastControlDeck = (props: any) => {
  const { onChange } = props
  const client = useClient({ apiVersion: '2024-04-24' })
  const toast = useToast()
  
  // 1. Listen to the Hub's current state
  const contentRef = useFormValue(['content']) as any
  const missionTargets = useFormValue(['targets']) as any[] || []
  const missionStatus = useFormValue(['status']) as string
  const documentId = useFormValue(['_id']) as string

  // 2. Component State
  const [channels, setChannels] = useState<any[]>([])
  const [sourceContent, setSourceContent] = useState<any>(null)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // 3. Load Channels & Verify Source Content
  useEffect(() => {
    client.fetch(`*[_type == "socialChannel" && isActive == true]`).then(setChannels)
  }, [])

  useEffect(() => {
    if (contentRef?._ref) {
      setIsVerifying(true)
      client.fetch(`*[_id == $ref][0]`, { ref: contentRef._ref }).then(doc => {
        setSourceContent(doc)
        setIsVerifying(false)
      })
    } else {
      setSourceContent(null)
    }
  }, [contentRef?._ref])

  // 4. THE MISSION LAUNCHER
  const launchMission = async () => {
    if (!contentRef?._ref || missionTargets.length === 0) {
      toast.push({ status: 'warning', title: 'Mission Parameters Incomplete', description: 'Select content and at least one tactical target.' })
      return
    }

    setIsLaunching(true)
    
    // Update Mission Status locally first
    onChange(set('streaming', ['status']))

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin.replace('3333', '3000') : ''
      const payloadTargets = []

      // Map tactical targets to channel IDs
      for (const t of missionTargets) {
        const platform = String(t.platform || '')
        const placement = String(t.placement || 'feed')
        const channel = channels.find(c => c.platform === platform || (platform === 'website' && c.platform === 'website'))
        
        if (channel) {
          // Send platform||placement||channelId
          payloadTargets.push(`${channel.platform}||${placement}||${channel._id}`)
        }
      }

      console.log('🚀 TACTICAL MISSION STARTING...', payloadTargets)

      const response = await fetch(`${baseUrl}/api/social/publish/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: contentRef._ref,
          targets: payloadTargets
        })
      })

      if (response.ok) {
        toast.push({ status: 'success', title: 'Mission Success', description: 'All tactical placements reported back successful.' })
        onChange(set('success', ['status']))
      } else {
        const error = await response.json()
        onChange(set('failed', ['status']))
        toast.push({ status: 'error', title: 'Mission Aborted', description: error.message })
      }
    } catch (err: any) {
       onChange(set('failed', ['status']))
       toast.push({ status: 'error', title: 'Critical System Error', description: err.message })
    } finally {
      setIsLaunching(false)
    }
  }

  // Safe Display Constants
  const payloadLabel = sourceContent ? `READY: "${sourceContent.title || 'Untitled Payload'}"` : 'NO PAYLOAD SELECTED'
  const displayStatus = String(missionStatus || 'pending').toUpperCase()

  return (
    <Stack space={4}>
      {/* THE STEERING WHEEL (Standard Fields) */}
      <Card padding={4} radius={2} border shadow={1} tone="transparent">
        <Stack space={4}>
           <Label size={1} muted style={{ textTransform: 'uppercase' }}>🔧 Mission Configuration</Label>
           {props.renderDefault(props)}
        </Stack>
      </Card>

      {/* 1. SOURCE VERIFICATION PANEL */}
      <Card padding={4} radius={3} border tone={sourceContent ? 'positive' : 'inherit'} shadow={1}>
        <Stack space={4}>
          <Flex align="center" gap={3}>
            <Box flex={1}>
              <Label size={1} muted style={{ textTransform: 'uppercase' }}>🛰️ MISSION PAYLOAD STATUS</Label>
              <Text weight="bold" size={2} style={{ marginTop: '8px', display: 'block' }}>
                {isVerifying ? 'Scanning Cloud for Payload...' : payloadLabel}
              </Text>
            </Box>
            {isVerifying ? <Spinner /> : (sourceContent ? <CheckmarkCircleIcon style={{ color: '#4caf50', fontSize: '24px' }} /> : <ErrorOutlineIcon style={{ color: '#f44336', fontSize: '24px' }} />)}
          </Flex>
          {sourceContent && (
             <Badge tone="positive" mode="outline">Source ID: {sourceContent._id}</Badge>
          )}
        </Stack>
      </Card>

      {/* 2. TACTICAL READINESS & PRECISION MONITOR */}
      {sourceContent && (
        <Card padding={4} radius={3} border shadow={1}>
          <Stack space={4}>
            <Label size={1} muted style={{ textTransform: 'uppercase' }}>📡 TACTICAL READINESS</Label>
            <Grid columns={[1, 2]} gap={3}>
               {missionTargets?.filter((t: any) => t.platform).map((t: any, idx: number) => {
                 const pLabel = String(t.platform || '').toUpperCase()
                 const fLabel = String(t.placement || 'FEED').toUpperCase()
                 return (
                   <Card key={`${t.platform}-${idx}`} padding={3} radius={2} border tone="primary">
                      <Flex align="center" justify="space-between" gap={2}>
                         <Text size={1} weight="bold">{pLabel}</Text>
                         <Badge tone="primary">{fLabel}</Badge>
                      </Flex>
                   </Card>
                 )
               })}
               {(missionTargets?.length === 0) && (
                 <Text size={1} muted style={{ fontStyle: 'italic' }}>Define your Mission Loadout in the configuration above to prepare tactical placements.</Text>
               )}
            </Grid>
          </Stack>
        </Card>
      )}

      {/* 3. MASTER TRIGGER */}
      <Box paddingY={4}>
        <Button
          text={isLaunching ? "TRANSMITTING..." : "INITIATE TACTICAL LAUNCH 🚀"}
          tone="primary"
          padding={4}
          mode="default"
          style={{ width: '100%', height: '60px', fontSize: '18px', fontWeight: 'bold' }}
          icon={RocketIcon}
          onClick={launchMission}
          disabled={!sourceContent || !missionTargets || missionTargets.length === 0 || isLaunching}
          loading={isLaunching}
        />
        <Box marginTop={3} style={{ textAlign: 'center' }}>
          <Text size={1} muted style={{ fontStyle: 'italic' }}>
            (If you want to launch it now and no automation set, else hit publish)
          </Text>
        </Box>
      </Box>

      {/* 4. MISSION LOG SUMMARY */}
      {missionStatus && missionStatus !== 'pending' && (
        <Card padding={4} radius={2} border tone={missionStatus === 'success' ? 'positive' : 'critical'}>
           <Flex align="center" gap={3}>
              <Text size={1} weight="bold">
                 MISSION {displayStatus} 🏁
              </Text>
              <Text size={1} muted>
                 Handshake completed at {new Date().toLocaleTimeString()}
              </Text>
           </Flex>
        </Card>
      )}
    </Stack>
  )
}
