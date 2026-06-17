import PDFDocument from 'pdfkit'
import supabase from '../config/supabaseClient.js'

const generatePrescriptionPdf = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const userRole = req.user.role

        const { data: prescription, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' })
        }

        const isPatient = userRole === 'patient' && prescription.patient_id === userId
        let isDoctor = false

        if (userRole === 'doctor') {
            const { data: doctor } = await supabase
                .from('doctor_profiles')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle()
            isDoctor = doctor?.id === prescription.doctor_id
        }

        if (!isPatient && !isDoctor) {
            return res.status(403).json({ success: false, message: 'Access denied' })
        }

        const { data: doctorProfile } = await supabase
            .from('doctor_profiles')
            .select('specialization, user_id')
            .eq('id', prescription.doctor_id)
            .maybeSingle()

        let doctorName = 'Doctor'
        let patientName = 'Patient'

        const userIds = [doctorProfile?.user_id, prescription.patient_id].filter(Boolean)
        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email')
                .in('id', userIds)
            const usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
            doctorName = usersMap[doctorProfile?.user_id]?.name || doctorName
            patientName = usersMap[prescription.patient_id]?.name || patientName
        }

        const medicines = prescription.medicines || []
        const createdDate = new Date(prescription.created_at).toLocaleDateString('en-PK', {
            year: 'numeric', month: 'long', day: 'numeric',
        })

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="prescription-${id.slice(0, 8)}.pdf"`)

        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        doc.pipe(res)

        doc.fontSize(22).fillColor('#0891b2').text('Doctor Hub', { align: 'center' })
        doc.fontSize(10).fillColor('#64748b').text('E-Prescription', { align: 'center' })
        doc.moveDown(0.5)
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').stroke()
        doc.moveDown(1)

        doc.fontSize(11).fillColor('#0f172a')
        doc.text(`Doctor: Dr. ${doctorName}`)
        if (doctorProfile?.specialization) doc.text(`Specialization: ${doctorProfile.specialization}`)
        doc.text(`Patient: ${patientName}`)
        doc.text(`Date: ${createdDate}`)
        doc.moveDown(1)

        doc.fontSize(13).fillColor('#0891b2').text('Prescribed Medicines')
        doc.moveDown(0.5)

        medicines.forEach((med, i) => {
            const name = med.name || med.medicine || `Medicine ${i + 1}`
            doc.fontSize(11).fillColor('#0f172a').text(`${i + 1}. ${name}`)
            if (med.dosage) doc.fontSize(10).fillColor('#475569').text(`   Dosage: ${med.dosage}`)
            if (med.duration) doc.fontSize(10).fillColor('#475569').text(`   Duration: ${med.duration}`)
            if (med.frequency) doc.fontSize(10).fillColor('#475569').text(`   Frequency: ${med.frequency}`)
            doc.moveDown(0.4)
        })

        if (prescription.instructions) {
            doc.moveDown(0.5)
            doc.fontSize(13).fillColor('#0891b2').text('Instructions')
            doc.fontSize(10).fillColor('#475569').text(prescription.instructions)
        }

        doc.moveDown(2)
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').stroke()
        doc.moveDown(0.5)
        doc.fontSize(8).fillColor('#94a3b8').text(
            'This is a digitally generated e-prescription from Doctor Hub. For verification, contact the issuing doctor.',
            { align: 'center' }
        )

        doc.end()
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}

export { generatePrescriptionPdf }
