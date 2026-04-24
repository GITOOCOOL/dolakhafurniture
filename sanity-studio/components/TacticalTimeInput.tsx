import React from 'react'
import { Stack, Box, Flex, Text, Button, Card, Label, TextInput } from '@sanity/ui'
import { set } from 'sanity'

/**
 * TACTICAL TIME INPUT
 * A professional high-precision time picker for Sanity missions.
 */
export const TacticalTimeInput = (props: any) => {
  const { value, onChange } = props
  const currentTime = value || '00:00:00'
  const parts = currentTime.split(':')
  
  const updateTime = (unitIdx: number, delta: number) => {
    const newParts = [...parts]
    while(newParts.length < 3) newParts.push('00')
    
    let val = parseInt(newParts[unitIdx] || '0')
    val += delta
    
    // Logic: 0 -> H, 1 -> M, 2 -> S
    if (unitIdx === 0) val = (val + 24) % 24
    else val = (val + 60) % 60
    
    newParts[unitIdx] = val.toString().padStart(2, '0')
    onChange(set(newParts.join(':')))
  }

  const syncToNow = () => {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    onChange(set(timeStr))
  }

  return (
    <Stack space={3}>
      <Flex align="center" justify="space-between">
         <Label size={1} muted>LAUNCH CHRONOMETER (HH:MM:SS)</Label>
         <Button 
            text="SYNC TO NOW 🕗" 
            fontSize={1} 
            padding={2} 
            mode="ghost" 
            tone="primary" 
            onClick={syncToNow} 
          />
      </Flex>
      
      <Card padding={3} radius={2} border style={{ background: 'rgba(0,0,0,0.01)' }}>
        <Flex align="center" justify="center" gap={4}>
          {['HOUR', 'MIN', 'SEC'].map((label, idx) => {
            const val = parts[idx] || '00'
            
            const handleManualEntry = (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
              let newVal = parseInt(e.currentTarget.value || '0')
              const limit = idx === 0 ? 23 : 59
              if (newVal > limit) newVal = limit
              if (newVal < 0) newVal = 0
              
              const newParts = [...parts]
              while(newParts.length < 3) newParts.push('00')
              newParts[idx] = newVal.toString().padStart(2, '0')
              onChange(set(newParts.join(':')))
            }

            return (
              <Stack key={label} space={2} align="center">
                <Label size={0} muted>{label}</Label>
                <Flex align="center" gap={1}>
                   <Button fontSize={1} padding={2} mode="bleed" text="-" onClick={() => updateTime(idx, -1)} />
                   <Box style={{ width: '60px' }}>
                     <TextInput 
                        type="number" 
                        value={val} 
                        onChange={handleManualEntry}
                        fontSize={2}
                        weight="bold"
                        style={{ textAlign: 'center' }}
                     />
                   </Box>
                   <Button fontSize={1} padding={2} mode="bleed" text="+" onClick={() => updateTime(idx, 1)} />
                </Flex>
              </Stack>
            )
          })}
        </Flex>
      </Card>
      <Text size={1} muted style={{ fontStyle: 'italic' }}>Precision pulse calibrated for 60-second intervals.</Text>
    </Stack>
  )
}
