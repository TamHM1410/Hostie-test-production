
import Button from '@mui/material/Button';


export default function ButtonCustom({ text, size, marginBottom, }: { text: string, size: string|any, marginBottom?: number }) {
    return (
        <Button size={size} sx={{
            background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)',
            color: 'white',
            '&:hover': {
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)'
            }, marginBottom: marginBottom,

        }}>{text}</Button>
    )
}