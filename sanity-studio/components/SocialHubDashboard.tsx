import React, { useState, useEffect } from 'react'
import { Stack, Box, Flex, Text, Button, Card, Grid, Checkbox, Badge, Label, Portal, useToast } from '@sanity/ui'
import { set, setIfMissing, useFormValue, useClient } from 'sanity'
import { RocketIcon, TrashIcon } from '@sanity/icons'

/**
 * Omni-Channel Distribution Dashboard
 * This component acts as the 'Configuration Deck' for the fleet.
 * Includes a FLOATING INTERCEPTOR mission control for instant launches.
 */
export const SocialHubDashboard = (props: any) => {
  const { value, onChange } = props
  const client = useClient({ apiVersion: '2024-04-24' })
  const toast = useToast()
  const [channels, setChannels] = useState<any[]>([])
  const [isLaunching, setIsLaunching] = useState(false)
  
  const docType = useFormValue(['type']) as string
  const documentId = useFormValue(['_id']) as string
  const plannedTargets = value?.plannedTargets || []

  // Get type display name (for labeling)
  const typeDisplay = docType ? docType.charAt(0).toUpperCase() + docType.slice(1) : 'Content'

  // 1. Fetch available connected channels
  useEffect(() => {
    client.fetch(`*[_type == "socialChannel" && isActive == true]`).then(setChannels)
  }, [])

  const handleToggle = (targetId: string) => {
    const nextValue = plannedTargets.includes(targetId)
      ? plannedTargets.filter((t: string) => t !== targetId)
      : [...plannedTargets, targetId]
    
    onChange([
      setIfMissing([], ['plannedTargets']),
      set(nextValue, ['plannedTargets'])
    ])
  }

  const performBroadcast = async (shouldKillBot: boolean) => {
    if (plannedTargets.length === 0) {
      toast.push({ status: 'warning', title: 'Target Selector Empty', description: 'Please select at least one channel to launch.' })
      return
    }

    setIsLaunching(true)
    try {
      // SCRUB THE ID: Remove 'drafts.' prefix if present to ensure API compatibility
      const scrubbedId = documentId.replace('drafts.', '')
      console.log('🛰️ PREPARING BROADCAST FOR ID:', scrubbedId)

      // 1. SILENCE THE BOT IF REQUESTED
      if (shouldKillBot) {
        await client.patch(documentId).set({ 'automation.enabled': false }).commit()
      }

      // 2. TRIGGER THE BROADCAST ENGINE
      const baseUrl = typeof window !== 'undefined' ? window.location.origin.replace('3333', '3000') : ''
      const response = await fetch(`${baseUrl}/api/social/publish/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: scrubbedId,
          targets: plannedTargets
        })
      })

      if (response.ok) {
        toast.push({ 
          status: 'success', 
          title: 'Mission Success', 
          description: shouldKillBot 
            ? `Transmission complete. Bot deactivated.`
            : `Instant Pulsed transmission complete. Bot remains active.` 
        })
      } else {
        const error = await response.json()
        toast.push({ status: 'error', title: 'Transmission Failed', description: error.message })
      }
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Critical Failure', description: err.message })
    } finally {
      setIsLaunching(false)
    }
  }

  const handleLaunchNowOnly = () => performBroadcast(false)
  const handleLaunchAndKillBot = () => performBroadcast(true)

  const handleDeleteEntry = async (platform: string, id: string, token: string, channelName: string, index: number) => {
    if (!window.confirm("Permanently delete this instance?")) return

    try {
      const channel = channels.find(c => c.name === channelName)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin.replace('3333', '3000') : ''
      let endpoint = channel?.targetUrl || `${baseUrl}/api/social/publish/${platform}`
      
      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, targetToken: token })
      })

      onChange(set(value?.history?.filter((_: any, i: number) => i !== index), ['history']))
    } catch (err) {
       alert("External deletion failed, but entry removed from local history.")
    }
  }

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} border tone="transparent">
        <Stack space={4}>
          <Flex align="center">
            <Box flex={1}>
              <Text weight="bold" size={2}>
                🤖 Omni-Channel Automation Bot
              </Text>
            </Box>
            <Badge tone="primary">AUTOPILOT INTEGRITY ACTIVE</Badge>
          </Flex>
          
          <Card padding={3} radius={2} tone="primary" border>
             <Stack space={3}>
                <Text size={1}>
                   This content's distribution is managed via the <b>Content Broadcast Hub 🚀</b>.
                </Text>
                <Text size={1} muted style={{ fontStyle: 'italic' }}>
                   Configure standard automation bots below. The fleet history is now centralized in Mission Control.
                </Text>
             </Stack>
          </Card>
        </Stack>
      </Card>
    </Stack>
  )
}
