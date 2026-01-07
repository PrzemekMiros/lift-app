import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  workoutInner: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  backButtonContainer: {
    marginTop: 6,
    marginBottom: 8,
    paddingVertical: 8,
  },
  backLink: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#3a3450',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a445f',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardSub: {
    color: colors.muted,
    fontSize: 11,
  },
  cardArrow: {
    color: colors.accent,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.accent,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: '#201c2b',
    fontWeight: '600',
  },
  outlineBtn: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.accent,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#3a3450',
    color: colors.text,
    padding: 12,
    borderRadius: 12,
  },
  inputSmall: {
    backgroundColor: '#3a3450',
    color: colors.text,
    padding: 12,
    borderRadius: 12,
    width: 75,
    marginRight: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontWeight: '600',
    color: '#201c2b',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#3a3450',
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a445f',
  },
  setText: {
    color: colors.muted,
    fontWeight: '600',
  },
  setVal: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  removeText: {
    color: colors.error,
    fontSize: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  modalRow: {
    paddingHorizontal: 20,
  },
  modalInput: {
    flex: 1,
  },
  dbList: {
    paddingHorizontal: 20,
  },
  dbItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#4a445f',
  },
  dbItemText: {
    color: colors.text,
    fontSize: 16,
  },
  addSmall: {
    backgroundColor: colors.accent,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSmallText: {
    fontWeight: '700',
    color: '#201c2b',
    fontSize: 18,
  },
  closeBtn: {
    backgroundColor: '#2b263a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  closeBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default styles;
